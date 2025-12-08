'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export default function AdminSessionChecker({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()
        let timeout: NodeJS.Timeout

        const resetTimeout = () => {
            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                // Auto logout after inactivity
                await supabase.auth.signOut()
                router.push('/admin/login?timeout=true')
            }, SESSION_TIMEOUT)
        }

        // Reset timeout on user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        events.forEach(event => {
            window.addEventListener(event, resetTimeout)
        })

        // Start the timeout
        resetTimeout()

        // Cleanup
        return () => {
            clearTimeout(timeout)
            events.forEach(event => {
                window.removeEventListener(event, resetTimeout)
            })
        }
    }, [router])

    return <>{children}</>
}
