import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container flex flex-col gap-8 py-8 md:py-12 px-4 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Abalawe</h3>
                        <p className="text-sm text-muted-foreground">
                            Premium e-commerce experience.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Shop</h3>
                        <Link href="/products" className="text-sm text-muted-foreground hover:underline">All Products</Link>
                        <Link href="/categories" className="text-sm text-muted-foreground hover:underline">Categories</Link>
                        <Link href="/new-arrivals" className="text-sm text-muted-foreground hover:underline">New Arrivals</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Support</h3>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:underline">Contact Us</Link>
                        <Link href="/faq" className="text-sm text-muted-foreground hover:underline">FAQ</Link>
                        <Link href="/shipping" className="text-sm text-muted-foreground hover:underline">Shipping</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Legal</h3>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Abalawe Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
