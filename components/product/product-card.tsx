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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <Link href={`/products/${product.slug}`} className="font-semibold hover:underline">
                        {product.name}
                    </Link>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: product.currency || 'USD',
                        }).format(product.price)}
                    </span>
                    <Button size="sm" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}
