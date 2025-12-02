export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'customer' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'customer' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'customer' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    currency: string
                    image_urls: string[]
                    category: string | null
                    stock_quantity: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    currency?: string
                    image_urls?: string[]
                    category?: string | null
                    stock_quantity?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    currency?: string
                    image_urls?: string[]
                    category?: string | null
                    stock_quantity?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            carts: {
                Row: {
                    id: string
                    user_id: string | null
                    session_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            cart_items: {
                Row: {
                    id: string
                    cart_id: string
                    product_id: string
                    quantity: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    cart_id: string
                    product_id: string
                    quantity: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    cart_id?: string
                    product_id?: string
                    quantity?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
