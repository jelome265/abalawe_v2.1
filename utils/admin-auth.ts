import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Protects admin routes by verifying user authentication and admin role
 * @returns Promise<void> - Redirects if not authenticated or not admin
 */
export async function protectAdminRoute() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .single() as { data: { role: string } | null; error: any }

    if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut()
        redirect('/admin/login')
    }
}
