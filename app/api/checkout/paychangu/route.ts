import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { initiatePayment } from '@/utils/paychangu'
import { z } from 'zod'
import '@/utils/env' // Validate environment variables
import { rateLimitMiddleware } from '@/utils/rate-limit'

const checkoutSchema = z.object({
    orderId: z.string().uuid(),
    amount: z.number().positive(),
    email: z.string().email(),
})

export async function POST(req: Request) {
    // Rate limiting
    const rateLimitResult = rateLimitMiddleware(req as any)
    if (rateLimitResult) return rateLimitResult

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { orderId, amount, email } = checkoutSchema.parse(body)

        // Verify order belongs to user
        const { data: order } = await supabase
            .from('orders')
            .select('id')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single()

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Generate a unique transaction reference
        const txRef = `tx-${orderId}-${Date.now()}`

        // Initiate payment with PayChangu
        const paymentResponse = await initiatePayment({
            amount,
            currency: 'MWK',
            email,
            firstName: user.user_metadata.full_name?.split(' ')[0] || 'Customer',
            lastName: user.user_metadata.full_name?.split(' ')[1] || 'User',
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/paychangu`,
            returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${orderId}`,
            txRef,
        })

        if (paymentResponse.status === 'success' || paymentResponse.status === 'initiated') {
            // Update order with PayChangu transaction reference
            await supabase
                .from('orders')
                .update({
                    payment_transaction_id: txRef
                })
                .eq('id', orderId)

            return NextResponse.json({ checkout_url: paymentResponse.data.checkout_url })
        } else {
            throw new Error('Payment initiation returned unsuccessful status')
        }

    } catch (error: any) {
        console.error('PayChangu Checkout Error:', error)
        // Don't expose detailed error messages to client for security
        return NextResponse.json(
            { error: 'Checkout failed. Please try again.' },
            { status: 500 }
        )
    }
}
