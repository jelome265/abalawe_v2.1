import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Users, Settings, ShoppingCart, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check for admin role
    const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin'

    if (!isAdmin) {
        redirect('/')
    }

    // Fetch stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: productCount } = await (supabase.from('products') as any).select('*', { count: 'exact', head: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: orderCount } = await (supabase.from('orders') as any).select('*', { count: 'exact', head: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: userCount } = await (supabase.from('profiles') as any).select('*', { count: 'exact', head: true })

    // Calculate total revenue (simplified)
    const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq('status', 'paid') as { data: any[] | null, error: any }

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    const stats = [
        {
            title: 'Total Revenue',
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
            change: '+20.1% from last month',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Users',
            value: userCount || 0,
            change: 'Registered customers',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Active Products',
            value: productCount || 0,
            change: 'In stock and visible',
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Total Orders',
            value: orderCount || 0,
            change: '+19% from last month',
            icon: ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ]

    const quickLinks = [
        { title: 'Manage Users', href: '/admin/users', description: 'View and manage user accounts', icon: Users },
        { title: 'Manage Products', href: '/admin/products', description: 'Add, edit, and remove products', icon: Package },
        { title: 'Settings', href: '/admin/settings', description: 'Configure site settings', icon: Settings },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
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

            {/* Quick Links */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {quickLinks.map((link) => {
                        const Icon = link.icon
                        return (
                            <Link key={link.href} href={link.href}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{link.title}</h3>
                                                <p className="text-sm text-muted-foreground">{link.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
