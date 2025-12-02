'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem {
    id: string // Product ID
    quantity: number
    product: Product
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product) => Promise<void>
    removeItem: (productId: string) => Promise<void>
    updateQuantity: (productId: string, quantity: number) => Promise<void>
    clearCart: () => void
    isLoading: boolean
    cartTotal: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Load cart from LocalStorage on mount (for guests) 
    // In a full implementation, we would also fetch from Supabase if logged in
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart from local storage')
            }
        }
        setIsLoading(false)
    }, [])

    // Save to LocalStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = async (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { id: product.id, quantity: 1, product }]
        })
    }

    const removeItem = async (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId))
    }

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const cartTotal = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    )

    const itemCount = items.reduce((count, item) => count + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isLoading,
                cartTotal,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
