import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/product/product-card'
// import { notFound } from 'next/navigation'

interface CategoryPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params
    const categoryName = decodeURIComponent(slug)

    return {
        title: `${categoryName} | Abalawe`,
        description: `Browse our ${categoryName} collection.`,
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params
    const categoryName = decodeURIComponent(slug)
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', categoryName)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order('created_at', { ascending: false }) as { data: any[] | null, error: any }

    if (error) {
        console.error('Error fetching category products:', error)
        return <div>Error loading products.</div>
    }

    if (!products || products.length === 0) {
        return (
            <div className="container px-4 md:px-6 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4 capitalize">{categoryName}</h1>
                <p className="text-muted-foreground">No products found in this category.</p>
            </div>
        )
    }

    return (
        <div className="container px-4 md:px-6 py-12">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight capitalize">{categoryName}</h1>
                <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
