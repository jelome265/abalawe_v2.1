'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { cancelOrder } from '@/app/dashboard/orders/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CancelOrderButtonProps {
    orderId: string
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to remove this order?')) return

        setIsLoading(true)
        try {
            const result = await cancelOrder(orderId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Order removed successfully')
                router.refresh()
            }
        } catch (error) {
            console.error('Cancel order error:', error)
            toast.error('Failed to remove order')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4 mr-2" />
            )}
            Remove
        </Button>
    )
}
