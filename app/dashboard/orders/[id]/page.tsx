import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

// Correctly type the props for Next.js 15+ (params is a Promise)
interface OrderPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch order with items and product details
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                quantity,
                price_at_purchase,
                products (
                    name,
                    image_urls
                )
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !order) {
        console.error('Error fetching order:', error)
        notFound()
    }

    return (
        <div className="container max-w-4xl py-16 px-4 md:px-6">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-4">
                    {order.status === 'paid' ? (
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    ) : order.status === 'pending' ? (
                        <div className="h-16 w-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                            <Clock className="h-8 w-8" />
                        </div>
                    ) : (
                        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <XCircle className="h-8 w-8" />
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Order {order.status === 'paid' ? 'Confirmed' : 'Status'}</h1>
                        <p className="text-muted-foreground mt-2">
                            Order Reference: <span className="font-mono text-foreground font-medium">{order.payment_transaction_id || order.id}</span>
                        </p>
                    </div>
                </div>

                {/* Order Details Card */}
                <div className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="p-6 bg-muted/30 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Date Placed</p>
                                <p>{new Date(order.created_at!).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                <p className="text-xl font-bold">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: order.currency || 'USD'
                                    }).format(order.total_amount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="font-semibold mb-4">Items</h3>
                        <div className="space-y-4">
                            {order.order_items.map((item, index) => (
                                <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex gap-4">
                                        {/* Fallback for image */}
                                        <div className="h-16 w-16 bg-muted rounded object-cover overflow-hidden flex-shrink-0">
                                            {item.products?.image_urls?.[0] && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={item.products.image_urls[0]}
                                                    alt={item.products?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: order.currency || 'USD'
                                        }).format(item.price_at_purchase * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                        <Button size="lg">Continue Shopping</Button>
                    </Link>
                    <Link href="/dashboard/orders">
                        <Button variant="outline" size="lg">View All Orders</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
