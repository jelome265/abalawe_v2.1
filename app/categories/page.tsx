import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
    title: 'Categories | Abalawe',
    description: 'Browse products by category.',
}

export default async function CategoriesPage() {
    const supabase = await createClient()

    // Fetch all products to extract unique categories and a representative image for each
    const { data: products, error } = await supabase
        .from('products')
        .select('category, image_urls')
        .eq('is_active', true)
        .not('category', 'is', null) as { data: { category: string | null; image_urls: string[] | null }[] | null; error: Error | null }

    if (error) {
        console.error('Error fetching categories:', error)
        return <div>Error loading categories.</div>
    }

    // Process products to get unique categories with one image each
    const categoriesMap = new Map()
    products?.forEach(product => {
        if (product.category && !categoriesMap.has(product.category)) {
            categoriesMap.set(product.category, product.image_urls?.[0] || null)
        }
    })

    const categories = Array.from(categoriesMap.entries()).map(([name, image]) => ({
        name,
        image
    }))

    return (
        <div className="container px-4 md:px-6 py-12">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">
                    Find exactly what you're looking for.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Link key={category.name} href={`/categories/${encodeURIComponent(category.name)}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                            <div className="aspect-video relative bg-muted">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold capitalize">{category.name}</h2>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No categories found.
                </div>
            )}
        </div>
    )
}
