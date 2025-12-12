'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

type Product = Database['public']['Tables']['products']['Row']

interface AddToCartProps {
    product: Product
}

export function AddToCart({ product }: AddToCartProps) {
    const { addItem } = useCart()
    const [loading, setLoading] = useState(false)

    const handleAddToCart = async () => {
        setLoading(true)
        try {
            await addItem(product)
            toast.success('Added to cart')
        } catch (error) {
            console.error('Failed to add to cart:', error)
            toast.error('Failed to add to cart')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size="lg"
            className="flex-1 bg-[#00B9FD] hover:bg-[#00B9FD]/90 text-white border-none"
            disabled={product.stock_quantity === 0 || loading}
            onClick={handleAddToCart}
        >
            {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            Add to Cart
        </Button>
    )
}
