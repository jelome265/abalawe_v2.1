import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
    product: Partial<Product> & {
        id: string
        name: string
        price: number
        image_urls: string[]
        slug: string
        category?: string
    }
}

export function ProductCard({ product }: ProductCardProps) {
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
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: product.currency || 'USD',
                        }).format(product.price)}
                    </span>
                    <Button size="sm" variant="secondary" className="h-7 px-2 sm:h-9 sm:px-3">
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
