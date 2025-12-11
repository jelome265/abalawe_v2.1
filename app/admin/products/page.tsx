import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { protectAdminRoute } from '@/utils/admin-auth'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductActions } from './product-actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminProductsPage() {
    await protectAdminRoute()
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order('created_at', { ascending: false }) as { data: any[] | null, error: any }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: product.currency,
                                    }).format(product.price)}
                                </TableCell>
                                <TableCell>{product.stock_quantity}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <ProductActions productId={product.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {products?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
