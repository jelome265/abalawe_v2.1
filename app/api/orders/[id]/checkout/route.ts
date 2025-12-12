import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { initiatePayment } from '@/utils/paychangu'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    const { id } = await params
    const supabase: SupabaseClient<Database> = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client for writes to bypass RLS on update
    const supabaseAdmin = createAdminClient()

    // Fetch the order
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'pending') {
        return NextResponse.json({ error: 'Order is not pending' }, { status: 400 })
    }

    try {
        // Generate a NEW unique transaction reference for this attempt
        // We preserve the order ID but append a new timestamp
        const txRef = `tx-${order.id}-${Date.now()}`

        // Update the order with the new transaction ref BEFORE initiating payment
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                payment_transaction_id: txRef
            })
            .eq('id', order.id)

        if (updateError) {
            console.error('Failed to update txRef:', updateError)
            throw new Error('Database update failed')
        }

        // Initiate payment with PayChangu
        const paymentResponse = await initiatePayment({
            amount: order.total_amount,
            currency: order.currency || 'MWK',
            // We don't store email in orders table usually, so we might need to fetch it from user metadata 
            // or pass it in body. For now, let's use user email if available, or a fallback.
            // A better way is to pass email in the body, but for simplicity let's use user's auth email.
            email: user.email || 'customer@example.com',
            firstName: user.user_metadata.full_name?.split(' ')[0] || 'Customer',
            lastName: user.user_metadata.full_name?.split(' ')[1] || 'User',
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/paychangu`,
            returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${order.id}`,
            txRef,
        })

        if (paymentResponse.status === 'success' || paymentResponse.status === 'initiated') {
            return NextResponse.json({ checkout_url: paymentResponse.data.checkout_url })
        } else {
            throw new Error('Payment initiation returned unsuccessful status')
        }

    } catch (error) {
        console.error('Re-checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate payment' },
            { status: 500 }
        )
    }
}
