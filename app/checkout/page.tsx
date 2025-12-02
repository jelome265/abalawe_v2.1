'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/cart-provider'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const { items, cartTotal } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const handlePayment = async () => {
        setIsLoading(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?next=/checkout')
                return
            }

            // 1. Create Order in Supabase
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: cartTotal,
                    status: 'pending',
                    currency: 'MWK',
                })
                .select()
                .single()

            if (orderError) {
                console.error('Order creation error:', orderError)
                throw new Error('Failed to create order: ' + orderError.message)
            }

            if (!order) {
                throw new Error('Order was not created')
            }

            // 2. Initiate PayChangu Payment via Server Action/API Route
            const response = await fetch('/api/checkout/paychangu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    amount: cartTotal,
                    email: user.email,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed')
            }

            // 3. Redirect to PayChangu Checkout URL
            if (data.checkout_url) {
                window.location.href = data.checkout_url
            } else {
                throw new Error('No checkout URL returned')
            }

        } catch (error: any) {
            console.error(error)
            setMessage(error.message)
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return <div className="container py-12">Your cart is empty.</div>
    }

    return (
        <div className="container px-4 md:px-6 py-12 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="rounded-lg border p-6 space-y-6">
                <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>
                        {new Intl.NumberFormat('en-MW', {
                            style: 'currency',
                            currency: 'MWK',
                        }).format(cartTotal)}
                    </span>
                </div>

                {message && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        {message}
                    </div>
                )}

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Pay with PayChangu'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Secured by PayChangu
                </p>
            </div>
        </div>
    )
}
