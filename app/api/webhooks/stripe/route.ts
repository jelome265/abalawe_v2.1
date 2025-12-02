import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const sig = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            // Update order status in Supabase
            // This assumes we stored the order ID in metadata
            const orderId = paymentIntent.metadata.order_id
            if (orderId) {
                await supabase
                    .from('orders')
                    .update({ status: 'paid', stripe_payment_intent_id: paymentIntent.id })
                    .eq('id', orderId)
            }
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
