'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/cart-provider'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [isProcessing, setIsProcessing] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const handlePayment = async () => {
        setIsProcessing(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("Authentication required", {
                    description: "Please sign in to complete your purchase"
                })
                router.push('/login?redirect=/checkout')
                return
            }

            // Initiate PayChangu Payment via Server Action/API Route
            // We send items to the server to calculate the total amount securely
            const response = await fetch('/api/checkout/paychangu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    })),
                    email: user.email,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed')
            }

            // Redirect to PayChangu Checkout URL
            if (data.checkout_url) {
                clearCart()
                window.location.href = data.checkout_url
            } else {
                throw new Error('No checkout URL returned')
            }

        } catch (error: unknown) {
            console.error('Payment error:', error)
            const errorMsg = error instanceof Error ? error.message : "Something went wrong"
            setMessage(errorMsg)
            toast.error("Checkout failed", {
                description: errorMsg
            })
        } finally {
            setIsProcessing(false)
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
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Pay with PayChangu'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Secured by PayChangu
                </p>
            </div>
        </div>
    )
}
