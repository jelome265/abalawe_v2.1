'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { useEffect, useState } from 'react'

export function CartButton() {
    const { itemCount } = useCart()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch by only showing count after mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    return (
        <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                        {itemCount}
                    </span>
                )}
            </Button>
        </Link>
    )
}
