import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { verifyPayment } from '@/utils/paychangu'
import crypto from 'crypto'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-paychangu-signature')

        // CRITICAL: Verify webhook signature to prevent fraud
        if (!signature) {
            console.error('Missing PayChangu webhook signature')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify signature using HMAC SHA256
        const expectedSignature = crypto
            .createHmac('sha256', process.env.PAYCHANGU_SECRET_KEY!)
            .update(body)
            .digest('hex')

        // Use timingSafeEqual to prevent timing attacks
        const signatureBuffer = Buffer.from(signature)
        const expectedBuffer = Buffer.from(expectedSignature)

        if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
            console.error('Invalid PayChangu webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const data = JSON.parse(body)
        const { tx_ref, status } = data

        if (status === 'successful') {
            // Verify the payment status with PayChangu API to be sure
            const verification = await verifyPayment(tx_ref)

            if (verification.status === 'success' && verification.data.status === 'successful') {
                const supabase = await createClient()

                // Find order by PayChangu tx_ref
                const { data: order } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('payment_transaction_id', tx_ref)
                    .single()

                if (order) {
                    // Idempotency check
                    if (order.status === 'paid') {
                        console.log('Order already paid:', order.id)
                        return NextResponse.json({ received: true })
                    }

                    // Verify amount matches
                    const paidAmount = verification.data.amount
                    // Allow small float difference or ensure exact match depending on API
                    if (Math.abs(paidAmount - order.total_amount) > 0.01) {
                        console.error(`Amount mismatch: Order ${order.total_amount}, Paid ${paidAmount}`)
                        return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
                    }

                    // Fetch order items to decrement stock
                    const { data: orderItems, error: itemsError } = await supabase
                        .from('order_items')
                        .select('product_id, quantity')
                        .eq('order_id', order.id)

                    if (itemsError || !orderItems) {
                        console.error('Failed to fetch order items:', itemsError)
                        return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 })
                    }

                    // Update order status to paid
                    await supabase
                        .from('orders')
                        .update({ status: 'paid' })
                        .eq('id', order.id)

                    // Decrement stock for each item
                    for (const item of orderItems) {
                        // Note: This is not a DB transaction, so potential race condition if multiple webhooks exact same time
                        // But we have idempotency check above.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const { error: rpcError } = await (supabase.rpc as any)('decrement_stock', {
                            row_id: item.product_id,
                            quantity_to_decrement: item.quantity
                        })

                        if (rpcError) {
                            // Fallback if RPC doesn't exist: Read-Update-Write (Less safe)
                            const { data: product } = await supabase
                                .from('products')
                                .select('stock_quantity')
                                .eq('id', item.product_id!)
                                .single()

                            if (product && product.stock_quantity !== null) {
                                await supabase
                                    .from('products')
                                    .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
                                    .eq('id', item.product_id!)
                            }
                        }
                    }
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('PayChangu Webhook Error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
