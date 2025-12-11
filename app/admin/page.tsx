import { createClient } from '@/utils/supabase/server'
import { protectAdminRoute } from '@/utils/admin-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import {
    Package, Users, ShoppingCart, TrendingUp,
    DollarSign, Clock, CheckCircle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
    await protectAdminRoute()
    const supabase = await createClient()

    // Fetch stats using the working pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: productCount } = await (supabase.from('products') as any).select('*', { count: 'exact', head: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: orderCount } = await (supabase.from('orders') as any).select('*', { count: 'exact', head: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: userCount } = await (supabase.from('profiles') as any).select('*', { count: 'exact', head: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: pendingCount } = await (supabase.from('orders') as any).select('*', { count: 'exact', head: true }).eq('status', 'pending')

    // Get revenue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ordersQuery: any = await supabase.from('orders').select('total_amount').eq('status', 'paid')
    const orders = ordersQuery.data || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)

    // Get recent orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentQuery: any = await supabase
        .from('orders')
        .select('id, status, total_amount, currency, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    // Get top products
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productsQuery: any = await supabase
        .from('products')
        .select('id, name, price, stock_quantity')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)

    const recentOrders = recentQuery.data || []
    const topProducts = productsQuery.data || []

    const stats = [
        {
            title: 'Total Revenue',
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
            change: 'From paid orders',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Orders',
            value: orderCount || 0,
            change: `${pendingCount || 0} pending`,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Total Customers',
            value: userCount || 0,
            change: 'Registered users',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Active Products',
            value: productCount || 0,
            change: 'In catalog',
            icon: Package,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back! Here&apos;s your store overview.
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Package className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Orders */}
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest orders from your store</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                recentOrders.map((order: any) => {
                                    const getStatusColor = (status: string) => {
                                        switch (status) {
                                            case 'paid':
                                            case 'completed':
                                                return 'bg-green-100 text-green-800'
                                            case 'pending':
                                                return 'bg-yellow-100 text-yellow-800'
                                            default:
                                                return 'bg-gray-100 text-gray-800'
                                        }
                                    }

                                    const getStatusIcon = (status: string) => {
                                        switch (status) {
                                            case 'paid':
                                            case 'completed':
                                                return <CheckCircle className="h-4 w-4 text-green-600" />
                                            case 'pending':
                                                return <Clock className="h-4 w-4 text-yellow-600" />
                                            default:
                                                return <XCircle className="h-4 w-4 text-gray-600" />
                                        }
                                    }

                                    return (
                                        <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(order.status)}
                                                <div>
                                                    <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: order.currency || 'USD'
                                                    }).format(order.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent orders</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Your recent products</CardDescription>
                            </div>
                            <Link href="/admin/products">
                                <Button variant="outline" size="sm">Manage</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                topProducts.map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Stock: {product.stock_quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(product.price)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No products yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common admin tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/admin/products/new">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Package className="mr-3 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Add Product</div>
                                    <div className="text-xs text-muted-foreground">Create new product listing</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <Users className="mr-3 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Manage Users</div>
                                    <div className="text-xs text-muted-foreground">View customer accounts</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button variant="outline" className="w-full justify-start h-auto py-4">
                                <TrendingUp className="mr-3 h-5 w-5 text-primary" />
                                <div className="text-left">
                                    <div className="font-semibold">Settings</div>
                                    <div className="text-xs text-muted-foreground">Configure your store</div>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
