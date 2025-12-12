'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ProductCard } from '@/components/product/product-card'
import { BackButton } from '@/components/ui/back-button'
import { Database } from '@/types/database.types'
import { Loader2, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Product = Database['public']['Tables']['products']['Row']

export default function WishlistPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        // 1. Get IDs from localStorage
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

        const fetchProducts = async () => {
            if (storedWishlist.length === 0) {
                setIsLoading(false)
                return
            }

            const supabase = createClient()
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', storedWishlist)

                if (error) {
                    console.error('Error fetching wishlist products:', error)
                } else {
                    setProducts(data || [])
                }
            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (isLoading) {
        return (
            <div className="container min-h-[50vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="container px-4 md:px-6 py-12 space-y-8">
            <div className="flex flex-col gap-4">
                <BackButton />
                <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8 text-primary fill-current" />
                    <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
                </div>
                <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card/50">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Start saving your favorite items to find them easily later.
                    </p>
                    <Link href="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
