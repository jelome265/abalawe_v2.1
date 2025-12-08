
import Link from 'next/link'
import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react'
import AdminSessionChecker from '@/components/admin/session-checker'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {


    // Auth checks are now handled by middleware to prevent redirect loops
    // The middleware ensures only admins access these routes
    // Except for /admin/login which is public

    return (
        <AdminSessionChecker>
            <div className="flex min-h-screen">
                {/* Admin Sidebar */}
                <aside className="w-64 border-r bg-muted/40 hidden md:block">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-bold">Admin Console</h2>
                        <p className="text-xs text-muted-foreground mt-1">Administrator</p>
                    </div>
                    <nav className="px-4 py-4 space-y-2">
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
                    <div className="absolute bottom-0 w-64 p-4 border-t">
                        <Link href="/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-red-600">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </AdminSessionChecker>
    )
}
