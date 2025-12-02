import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch some stats (mocked for now or simple counts)
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount || 0}</div>
                        <p className="text-xs text-muted-foreground">In stock and visible</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount || 0}</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
