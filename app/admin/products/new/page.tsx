'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { protectAdminRouteClient } from '@/utils/admin-auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FormErrors {
    name?: string
    price?: string
    slug?: string
    stock_quantity?: string
    general?: string
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [uploadingImages, setUploadingImages] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>([])

    // Check admin authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const isAuthorized = await protectAdminRouteClient(router)
            if (!isAuthorized) {
                return // Will be redirected by protectAdminRouteClient
            }
        }
        checkAuth()
    }, [router])

    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImages(true)
        const supabase = createClient()

        try {
            const uploadedUrls: string[] = []

            for (const file of Array.from(files)) {
                // Validate file type and size
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name} is not an image file`)
                    continue
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} is too large (max 5MB)`)
                    continue
                }

                // Get signed upload URL
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                        size: file.size,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                    console.error('Upload API error:', errorData)

                    // Show helpful error message
                    if (response.status === 401) {
                        throw new Error('You must be logged in to upload images')
                    } else {
                        throw new Error(`Upload failed: ${errorData.error || 'Please ensure the "products" storage bucket exists in Supabase'}`)
                    }
                }

                const { url: signedUrl, path } = await response.json()

                // Upload file to Supabase storage
                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                })

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload file to storage')
                }

                // Get public URL
                const { data } = supabase.storage.from('products').getPublicUrl(path)
                uploadedUrls.push(data.publicUrl)
            }

            setImageUrls([...imageUrls, ...uploadedUrls])
            // Clear any previous errors
            if (errors.general) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { general, ...rest } = errors
                setErrors(rest)
            }
        } catch (error) {
            console.error('Image upload error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload images. Please try again.'
            alert(errorMessage)
        } finally {
            setUploadingImages(false)
            // Clear the file input
            e.target.value = ''
        }
    }

    const removeImage = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(e.currentTarget)
        // Add image URLs to form data
        formData.append('imageUrls', JSON.stringify(imageUrls))

        // Validation (Client-side)
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const price = formData.get('price') as string
        const stockQuantity = formData.get('stock_quantity') as string

        const validationErrors: FormErrors = {}

        if (!name || name.trim().length === 0) validationErrors.name = 'Product name is required'
        if (!slug || slug.trim().length === 0) validationErrors.slug = 'Slug is required'
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) validationErrors.price = 'Valid price is required'
        if (stockQuantity && (isNaN(parseInt(stockQuantity)) || parseInt(stockQuantity) < 0)) validationErrors.stock_quantity = 'Stock must be 0+'

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setLoading(false)
            return
        }

        try {
            // Import dynamically to avoid server-only module issues in client component
            const { createProduct } = await import('../actions')

            // Call Server Action
            const result = await createProduct({}, formData)

            if (result.error) {
                if (result.error.includes('Slug')) {
                    setErrors({ slug: result.error })
                } else {
                    setErrors({ general: result.error })
                }
                setLoading(false)
                return
            }

            // Success
            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error('Submission error:', error)
            setErrors({ general: 'Failed to create product. Please try again.' })
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            </div>

            {errors.general && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Product Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter product name"
                                onChange={(e) => {
                                    const slugInput = document.getElementById('slug') as HTMLInputElement
                                    if (slugInput && !slugInput.dataset.userModified) {
                                        slugInput.value = generateSlug(e.target.value)
                                    }
                                }}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="product-slug"
                                onChange={(e) => {
                                    e.target.dataset.userModified = 'true'
                                }}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                URL-friendly identifier (auto-generated from name, but you can edit it)
                            </p>
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter product description"
                                rows={4}
                            />
                        </div>

                        {/* Price and Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="price">
                                    Price <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    name="currency"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue="MWK"
                                >
                                    <option value="MWK">MWK - Malawi Kwacha</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="ZMW">ZMW</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="e.g., Electronics, Clothing, Books"
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input
                                id="stock_quantity"
                                name="stock_quantity"
                                type="number"
                                min="0"
                                defaultValue="0"
                                placeholder="0"
                            />
                            {errors.stock_quantity && (
                                <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                            )}
                        </div>

                        {/* Product Images */}
                        <div className="space-y-2">
                            <Label>Product Images</Label>
                            <div className="space-y-4">
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imageUrls.map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                                <Image
                                                    src={url}
                                                    alt={`Product image ${index + 1}`}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                        className="flex-1"
                                    />
                                    {uploadingImages && (
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Upload one or more product images (JPEG, PNG, WebP, GIF - max 5MB each)
                                </p>
                            </div>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                Product is active and visible to customers
                            </Label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading || uploadingImages}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Product
                            </Button>
                            <Link href="/admin/products">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
