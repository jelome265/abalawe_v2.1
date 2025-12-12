'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { CancelOrderButton } from './cancel-order-button'


type Order = Database['public']['Tables']['orders']['Row']

interface OrderActionsProps {
    order: Order
}

export function OrderActions({ order }: OrderActionsProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePayNow = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/orders/${order.id}/checkout`, {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate payment')
            }

            if (data.checkout_url) {
                // Redirect to PayChangu
                window.location.href = data.checkout_url
            } else {
                throw new Error('No checkout URL returned')
            }

        } catch (error) {
            console.error('Payment error:', error)
            toast.error('Failed to start payment. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 justify-end">
            <Link href={`/dashboard/orders/${order.id}`}>
                <Button variant="ghost" size="sm">
                    View
                </Button>
            </Link>

            {order.status === 'pending' && (
                <>
                    <Button
                        size="sm"
                        onClick={handlePayNow}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Pay Now'
                        )}
                    </Button>
                    <CancelOrderButton orderId={order.id} />
                </>
            )}
        </div>
    )
}
