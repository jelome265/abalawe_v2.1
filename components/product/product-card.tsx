'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'
import { useCart } from '@/components/providers/cart-provider'
import { toast } from 'sonner'
import { MouseEvent } from 'react'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart()

    const handleAddToCart = async (e: MouseEvent) => {
        e.preventDefault() // Prevent navigation to product page
        e.stopPropagation()
        try {
            await addItem(product)
            toast.success('Added to cart')
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error('Failed to add to cart')
        }
    }

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg">
            <Link href={`/products/${product.slug}`} className="aspect-square relative overflow-hidden bg-muted">
                {product.image_urls?.[0] ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No Image
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-2 sm:p-4">
                <div className="mb-1 sm:mb-2">
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{product.category}</p>
                    <Link href={`/products/${product.slug}`} className="text-sm sm:text-base font-semibold hover:underline line-clamp-2">
                        {product.name}
                    </Link>
                </div>
                <div className="mt-auto flex items-center justify-between gap-1">
                    <span className="text-sm sm:text-base font-bold">
                        {new Intl.NumberFormat('en-MW', {
                            style: 'currency',
                            currency: 'MWK',
                        }).format(product.price)}
                    </span>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 sm:h-9 sm:px-3 z-10 relative bg-[#00B9FD] hover:bg-[#00B9FD]/90 text-white border-none" // z-10 to ensure it's clickable above the Link if necessary, though nesting structure handles it usually.
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0}
                    >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
