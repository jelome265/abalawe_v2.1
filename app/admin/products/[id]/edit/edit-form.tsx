'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { updateProduct } from '../../actions'

interface FormErrors {
    name?: string
    price?: string
    slug?: string
    stock_quantity?: string
    general?: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description?: string | null
    price: number
    currency: string
    stock_quantity: number
    is_active: boolean
    category?: string | null
    image_urls?: string[] | null
}

interface EditProductFormProps {
    product: Product
}

export default function EditProductForm({ product }: EditProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [uploadingImages, setUploadingImages] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>(product.image_urls || [])

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
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name} is not an image file`)
                    continue
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} is too large (max 5MB)`)
                    continue
                }

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
                    throw new Error('Upload failed')
                }

                const { url: signedUrl, path } = await response.json()

                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                })

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload file to storage')
                }

                const { data } = supabase.storage.from('products').getPublicUrl(path)
                uploadedUrls.push(data.publicUrl)
            }

            setImageUrls([...imageUrls, ...uploadedUrls])
        } catch (error) {
            console.error('Image upload error:', error)
            alert('Failed to upload images')
        } finally {
            setUploadingImages(false)
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
        formData.append('imageUrls', JSON.stringify(imageUrls))

        // Validation
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const price = formData.get('price') as string
        const stockQuantity = formData.get('stock_quantity') as string

        const validationErrors: FormErrors = {}
        if (!name?.trim()) validationErrors.name = 'Name is required'
        if (!slug?.trim()) validationErrors.slug = 'Slug is required'
        if (!price || parseFloat(price) < 0) validationErrors.price = 'Valid price is required'
        if (stockQuantity && parseInt(stockQuantity) < 0) validationErrors.stock_quantity = 'Stock cannot be negative'

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setLoading(false)
            return
        }

        try {
            const result = await updateProduct(product.id, formData)

            if (result.error) {
                setErrors({ general: result.error })
            } else {
                router.push('/admin/products')
                router.refresh()
            }
        } catch (error) {
            console.error('Update error:', error)
            setErrors({ general: 'Failed to update product' })
        } finally {
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
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
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
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={product.name}
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

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={product.slug}
                                onChange={(e) => e.target.dataset.userModified = 'true'}
                                required
                            />
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={product.description || ''}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={product.price}
                                    required
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    name="currency"
                                    defaultValue={product.currency}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="MWK">MWK - Malawi Kwacha</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="ZMW">ZMW</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                defaultValue={product.category || ''}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input
                                id="stock_quantity"
                                name="stock_quantity"
                                type="number"
                                min="0"
                                defaultValue={product.stock_quantity}
                            />
                            {errors.stock_quantity && <p className="text-sm text-red-500">{errors.stock_quantity}</p>}
                        </div>

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
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                        className="flex-1"
                                    />
                                    {uploadingImages && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked={product.is_active}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                Product is active and visible to customers
                            </Label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading || uploadingImages}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
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
