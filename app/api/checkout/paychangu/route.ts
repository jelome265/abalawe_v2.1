import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { initiatePayment } from '@/utils/paychangu'
import { z } from 'zod'
import { Database, Tables } from '@/types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import '@/utils/env' // Validate environment variables
import { rateLimitMiddleware } from '@/utils/rate-limit'

const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
    })),
    email: z.string().email(),
})

export async function POST(req: NextRequest) {
    // Rate limiting
    const rateLimitResult = rateLimitMiddleware(req)
    if (rateLimitResult) return rateLimitResult

    // Regular client for Auth
    const supabase: SupabaseClient<Database> = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin client for DB operations (bypass RLS)
    const supabaseAdmin = createAdminClient()

    try {
        const body = await req.json()
        const { items, email } = checkoutSchema.parse(body)

        if (items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Fetch products to calculate total and check stock
        const { data: productsData, error: productsError } = await supabaseAdmin // Use admin to ensure we see all products
            .from('products')
            .select('id, price, name, stock_quantity')
            .in('id', items.map(item => item.id))

        if (productsError || !productsData) {
            throw new Error('Failed to fetch products')
        }

        // Explicitly type products to ensure TS knows the shape
        const products = productsData as Pick<Tables<'products'>, 'id' | 'price' | 'name' | 'stock_quantity'>[]

        // Calculate total amount and validate stock
        let totalAmount = 0
        for (const item of items) {
            const product = products.find((p) => p.id === item.id)
            if (!product) {
                throw new Error(`Product not found: ${item.id}`)
            }

            // Handle potentially null stock_quantity
            const stock = product.stock_quantity ?? 0
            if (stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}. Only ${stock} available.` },
                    { status: 400 }
                )
            }

            totalAmount += product.price * item.quantity
        }
        // Create Order in Supabase (Server-side)
        console.log('Attempting to create order for user:', user.id)

        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: totalAmount,
                status: 'pending',
                currency: 'MWK',
            })
            .select()
            .single()

        if (orderError || !orderData) {
            console.error('Order creation error:', orderError)
            throw new Error(`Failed to create order: ${orderError?.message || 'Unknown error'}`)
        }

        const order = orderData as Tables<'orders'>

        // Create Order Items
        const orderItemsData = items.map(item => {
            const product = products.find((p) => p.id === item.id)
            return {
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_purchase: product!.price
            }
        })

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsData)

        if (itemsError) {
            console.error('Order items creation error:', itemsError)
            // Ideally we should rollback the order here, but for now we throw
            throw new Error('Failed to create order items')
        }

        // Generate a unique transaction reference
        const txRef = `tx-${order.id}-${Date.now()}`

        // Initiate payment with PayChangu
        console.log('Initiating PayChangu payment with ref:', txRef)
        const paymentResponse = await initiatePayment({
            amount: totalAmount,
            currency: 'MWK',
            email,
            firstName: user.user_metadata.full_name?.split(' ')[0] || 'Customer',
            lastName: user.user_metadata.full_name?.split(' ')[1] || 'User',
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/paychangu`,
            returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${order.id}`,
            txRef,
        })

        if (paymentResponse.status === 'success' || paymentResponse.status === 'initiated') {
            // Update order with PayChangu transaction reference
            await supabaseAdmin
                .from('orders')
                .update({
                    payment_transaction_id: txRef
                })
                .eq('id', order.id)

            return NextResponse.json({ checkout_url: paymentResponse.data.checkout_url })
        } else {
            throw new Error('Payment initiation returned unsuccessful status')
        }

    } catch (error: unknown) {
        console.error('PayChangu Checkout Error:', error)
        // Don't expose detailed error messages to client for security
        // TEMPORARY: Expose detailed error for debugging
        return NextResponse.json(
            { error: `Debug Error: ${error instanceof Error ? error.message : JSON.stringify(error)}` },
            { status: 500 }
        )
    }
}
