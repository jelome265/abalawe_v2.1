import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Package, Settings, LogOut } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single() as { data: { full_name: string } | null, error: any }

    return (
        <div className="container px-4 md:px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {profile?.full_name || user.email}
                    </p>
                </div>
                <form action="/auth/signout" method="post">
                    <Button variant="outline" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Orders Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Recent Orders</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        View and track your recent purchases.
                    </p>
                    <Link href="/dashboard/orders">
                        <Button variant="secondary" className="w-full">View Orders</Button>
                    </Link>
                </div>

                {/* Settings Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Account Settings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Manage your profile, security, and preferences.
                    </p>
                    <Link href="/dashboard/settings">
                        <Button variant="secondary" className="w-full">Manage Settings</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
