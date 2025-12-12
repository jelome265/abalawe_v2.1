'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelOrder(orderId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // specific check: ensure order belongs to user and is pending
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status, user_id')
        .eq('id', orderId)
        .single()

    if (fetchError || !order) {
        return { error: 'Order not found' }
    }

    if (order.user_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    if (order.status !== 'pending') {
        return { error: 'Only pending orders can be removed' }
    }

    // 1. Delete order items first (safeguard against missing CASCADE and RLS blockers on cascade)
    const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId)

    if (deleteItemsError) {
        console.error('Error deleting order items:', deleteItemsError)
        // Check if it's strictly a permission issue, but usually we just want to fail gracefully
        // We continue to try deleting the order ONLY if items are gone or empty, but here we error out to be safe.
        // Actually, if RLS blocks item deletion, we can't delete the order anyway if FK exists.
        return { error: 'Failed to delete order items. Check permissions.' }
    }

    // 2. Delete the order
    const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

    if (deleteError) {
        console.error('Error deleting order:', deleteError)
        return { error: deleteError.message || 'Failed to delete order' }
    }

    revalidatePath('/dashboard/orders')
    return { success: true }
}
