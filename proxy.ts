import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import '@/utils/env' // Validate environment variables on startup
import { Database } from '@/types/database.types'

export async function proxy(request: NextRequest) {
    // Admin routes protection - verify role before allowing access
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Skip middleware for admin login page
        if (request.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.next()
        }

        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set() {
                        // No-op for middleware
                    },
                    remove() {
                        // No-op for middleware
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // Not authenticated - redirect to admin login
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Verify admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Not admin - redirect to 403
        if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/403', request.url))
        }
    }

    const response = await updateSession(request)

    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // Content Security Policy
    // Note: strict-dynamic requires a nonce, which is complex in Next.js middleware without specialized setup.
    // For now, we use a robust policy allowing necessary domains.
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.paychangu.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://*.supabase.co;
        font-src 'self';
        connect-src 'self' https://*.supabase.co https://api.paychangu.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()

    response.headers.set('Content-Security-Policy', cspHeader)

    return response
}

export const proxyConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
