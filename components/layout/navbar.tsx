import Link from 'next/link'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span>Abalawe</span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Products
                    </Link>
                    <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Categories
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        About
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" aria-label="Cart">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>

                    {user ? (
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" aria-label="Dashboard">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm">
                                Login
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
