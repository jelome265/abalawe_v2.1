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

        if (signature !== expectedSignature) {
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
                    .select('id')
                    .eq('payment_transaction_id', tx_ref)
                    .single()

                if (order) {
                    await supabase
                        .from('orders')
                        .update({ status: 'paid' })
                        .eq('id', order.id)
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('PayChangu Webhook Error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
