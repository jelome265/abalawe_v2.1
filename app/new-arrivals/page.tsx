import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/product/product-card'

export const metadata = {
    title: 'New Arrivals | Abalawe',
    description: 'Check out our latest products.',
}

export default async function NewArrivalsPage() {
    const supabase = await createClient()
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .limit(12) as { data: any[] | null, error: any }

    if (error) {
        console.error('Error fetching new arrivals:', error)
        return <div>Error loading new arrivals.</div>
    }

    return (
        <div className="container px-4 md:px-6 py-12">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">New Arrivals</h1>
                <p className="text-muted-foreground">
                    The latest additions to our collection.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No new arrivals found.
                </div>
            )}
        </div>
    )
}
