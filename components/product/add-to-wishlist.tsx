'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface AddToWishlistProps {
    product: Product
}

export function AddToWishlist({ product }: AddToWishlistProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)

    // Load initial state from local storage (client-side only)
    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        // Wrap in setTimeout to avoid "synchronous setState" warning and allow paint
        const timer = setTimeout(() => {
            setIsWishlisted(wishlist.includes(product.id))
        }, 0)
        return () => clearTimeout(timer)
    }, [product.id])

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

        if (isWishlisted) {
            const newWishlist = wishlist.filter((id: string) => id !== product.id)
            localStorage.setItem('wishlist', JSON.stringify(newWishlist))
            setIsWishlisted(false)
            toast.info('Removed from wishlist')
        } else {
            wishlist.push(product.id)
            localStorage.setItem('wishlist', JSON.stringify(wishlist))
            setIsWishlisted(true)
            toast.success('Added to wishlist')
        }
    }

    return (
        <Button
            size="lg"
            variant="outline"
            className={`transition-colors ${isWishlisted ? 'text-red-500 hover:text-red-600 border-red-200 bg-red-50' : ''}`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
    )
}
