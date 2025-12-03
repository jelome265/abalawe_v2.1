import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getProduct(slug: string): Promise<Product | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single() as { data: unknown, error: unknown }

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return data as Product | null
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: `${product.name} | Abalawe`,
        description: product.description || `Buy ${product.name} at Abalawe.`,
        openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} at Abalawe.`,
            images: product.image_urls || [],
        },
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="container px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image Gallery */}
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    {product.image_urls?.[0] ? (
                        <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                        <div className="mt-4 flex items-end gap-4">
                            <span className="text-3xl font-bold">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: product.currency,
                                }).format(product.price)}
                            </span>
                            {product.stock_quantity > 0 ? (
                                <span className="mb-1 text-sm text-green-600 font-medium">In Stock</span>
                            ) : (
                                <span className="mb-1 text-sm text-red-600 font-medium">Out of Stock</span>
                            )}
                        </div>
                    </div>

                    <div className="prose prose-sm text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Button size="lg" className="flex-1" disabled={product.stock_quantity === 0}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button size="lg" variant="outline" aria-label="Add to Wishlist">
                            <Heart className="h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="ghost" aria-label="Share">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-2">Product Details</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                            <li>Category: {product.category}</li>
                            <li>SKU: {product.id.slice(0, 8)}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
