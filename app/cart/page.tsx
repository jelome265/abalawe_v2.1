'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/cart-provider'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, isLoading } = useCart()

    if (isLoading) {
        return <div className="container py-24 text-center">Loading cart...</div>
    }

    if (items.length === 0) {
        return (
            <div className="container flex flex-col items-center justify-center py-24 gap-4">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
                <Link href="/products">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container px-4 md:px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-6">
                            <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted shrink-0">
                                {item.product.image_urls?.[0] && (
                                    <Image
                                        src={item.product.image_urls[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium">
                                            <Link href={`/products/${item.product.slug}`} className="hover:underline">
                                                {item.product.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                    </div>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: item.product.currency,
                                        }).format(item.product.price * item.quantity)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="rounded-lg border bg-muted/40 p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(cartTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-sm text-muted-foreground">Calculated at checkout</span>
                        </div>

                        <div className="border-t my-4 pt-4 flex justify-between font-bold">
                            <span>Total</span>
                            <span>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(cartTotal)}
                            </span>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full" size="lg">
                                Checkout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
