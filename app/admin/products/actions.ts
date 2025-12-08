'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type CreateProductState = {
    message?: string
    error?: string
    success?: boolean
}

export async function createProduct(prevState: CreateProductState, formData: FormData): Promise<CreateProductState> {
    console.log('--- createProduct Server Action Started ---')
    console.log('Has Service Role Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    try {
        // 1. Verify user is admin (using standard auth client)
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: 'Authentication required' }
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!profile || (profile as any).role !== 'admin') {
            return { error: 'Admin permissions required' }
        }

        // 2. Parse form data
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const currency = formData.get('currency') as string || 'USD'
        const stockQuantity = parseInt(formData.get('stock_quantity') as string) || 0
        const isActive = formData.get('is_active') === 'on'
        const category = formData.get('category') as string
        const imageUrlsString = formData.get('imageUrls') as string
        const imageUrls = imageUrlsString ? JSON.parse(imageUrlsString) : []

        // 3. Insert product using ADMIN client (bypasses RLS)
        const adminSupabase = createAdminClient()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (adminSupabase.from('products') as any)
            .insert({
                name,
                slug,
                description: description || null,
                price,
                currency,
                stock_quantity: stockQuantity,
                is_active: isActive,
                category: category || null,
                image_urls: imageUrls,
            })

        if (error) {
            console.error('Admin Insert Error:', error)

            if (error.code === '23505') {
                return { error: 'Slug already in use' }
            }
            return { error: error.message }
        }

        revalidatePath('/admin/products')
        return { success: true, message: 'Product created successfully' }
    } catch (err) {
        console.error('SERVER ACTION ERROR:', err)
        // Check for specific error types
        if (err instanceof Error) {
            console.error('Error name:', err.name)
            console.error('Error message:', err.message)
            console.error('Error stack:', err.stack)
        }
        return { error: `Server Error: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
}

export async function deleteProduct(productId: string) {
    try {
        console.log('--- deleteProduct Server Action Started ---')
        // 1. Verify user is admin
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'Authentication required' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!profile || (profile as any).role !== 'admin') {
            return { error: 'Admin permissions required' }
        }

        // 2. Delete product using ADMIN client
        const adminSupabase = createAdminClient()

        const { error } = await adminSupabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) {
            console.error('Admin Delete Error:', error)
            return { error: error.message }
        }

        revalidatePath('/admin/products')
        return { success: true, message: 'Product deleted successfully' }
    } catch (err) {
        console.error('SERVER ACTION ERROR:', err)
        return { error: `Server Error: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
}

export async function updateProduct(productId: string, formData: FormData) {
    try {
        console.log('--- updateProduct Server Action Started ---')
        // 1. Verify user is admin
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'Authentication required' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!profile || (profile as any).role !== 'admin') {
            return { error: 'Admin permissions required' }
        }

        // 2. Parse form data
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const currency = formData.get('currency') as string || 'USD'
        const stockQuantity = parseInt(formData.get('stock_quantity') as string) || 0
        const isActive = formData.get('is_active') === 'on'
        const category = formData.get('category') as string
        const imageUrlsString = formData.get('imageUrls') as string
        const imageUrls = imageUrlsString ? JSON.parse(imageUrlsString) : undefined

        // 3. Update product using ADMIN client
        const adminSupabase = createAdminClient()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            name,
            slug,
            description: description || null,
            price,
            currency,
            stock_quantity: stockQuantity,
            is_active: isActive,
            category: category || null,
        }

        if (imageUrls) {
            updateData.image_urls = imageUrls
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (adminSupabase.from('products') as any)
            .update(updateData)
            .eq('id', productId)

        if (error) {
            console.error('Admin Update Error:', error)
            return { error: error.message }
        }

        revalidatePath('/admin/products')
        // We can't revalidate specific product path here easily as we are in admin
        // but it doesn't hurt.
        return { success: true, message: 'Product updated successfully' }
    } catch (err) {
        console.error('SERVER ACTION ERROR:', err)
        return { error: `Server Error: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
}
