import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Package, Users, Settings } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r bg-muted/40 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold">Admin Console</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <Package className="h-5 w-5" />
                        Products
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <Users className="h-5 w-5" />
                        Users
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
