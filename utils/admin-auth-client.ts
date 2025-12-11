import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * Client-side admin protection for client components
 * Checks authentication and admin role, redirects if not authorized
 * Note: This must be called inside a React component or custom hook
 */
export async function protectAdminRouteClient(router: ReturnType<typeof useRouter>) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        router.push('/admin/login')
        return false
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
        router.push('/admin/login')
        return false
    }

    return true
}
