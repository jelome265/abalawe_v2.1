import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditProductForm, { Product } from './edit-form'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

    // Map database result to Product interface, handling null currency
    const mappedProduct: Product = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        currency: product.currency || 'USD', // Default to USD if null
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active || false,
        category: product.category,
        image_urls: product.image_urls
    }

    return <EditProductForm product={mappedProduct} />
}
