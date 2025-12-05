import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { initiatePayment } from '@/utils/paychangu'
import { z } from 'zod'
import '@/utils/env' // Validate environment variables
import { rateLimitMiddleware } from '@/utils/rate-limit'

const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
    })),
    email: z.string().email(),
})

export async function POST(req: Request) {
    // Rate limiting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rateLimitResult = rateLimitMiddleware(req as any)
    if (rateLimitResult) return rateLimitResult

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { items, email } = checkoutSchema.parse(body)

        if (items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Fetch products to calculate total
        const productIds = items.map(item => item.id)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price, name')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .in('id', productIds) as { data: { id: string; price: number; name: string }[] | null, error: any }

        if (productsError || !products) {
            throw new Error('Failed to fetch products')
        }

        // Calculate total amount
        let totalAmount = 0
        for (const item of items) {
            const product = products.find((p: { id: string; price: number }) => p.id === item.id)
            if (!product) {
                throw new Error(`Product not found: ${item.id}`)
            }
            totalAmount += product.price * item.quantity
        }

        // Create Order in Supabase (Server-side)
        const { data: order, error: orderError } = await (supabase
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .from('orders') as any)
            .insert({
                user_id: user.id,
                total_amount: totalAmount,
                status: 'pending',
                currency: 'MWK',
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            throw new Error('Failed to create order')
        }

        // Generate a unique transaction reference
        const txRef = `tx-${order!.id}-${Date.now()}`

        // Initiate payment with PayChangu
        const paymentResponse = await initiatePayment({
            amount: totalAmount,
            currency: 'MWK',
            email,
            firstName: user.user_metadata.full_name?.split(' ')[0] || 'Customer',
            lastName: user.user_metadata.full_name?.split(' ')[1] || 'User',
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/paychangu`,
            returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${order!.id}`,
            txRef,
        })

        if (paymentResponse.status === 'success' || paymentResponse.status === 'initiated') {
            // Update order with PayChangu transaction reference
            await (supabase
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .from('orders') as any)
                .update({
                    payment_transaction_id: txRef
                })
                .eq('id', order!.id)

            return NextResponse.json({ checkout_url: paymentResponse.data.checkout_url })
        } else {
            throw new Error('Payment initiation returned unsuccessful status')
        }

    } catch (error: unknown) {
        console.error('PayChangu Checkout Error:', error)
        // Don't expose detailed error messages to client for security
        return NextResponse.json(
            { error: 'Checkout failed. Please try again.' },
            { status: 500 }
        )
    }
}
