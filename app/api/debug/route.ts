import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Test DB Access
        const { error: dbError } = await supabase.from('products').select('count').limit(1)

        // Test Env Vars
        const hasSecret = !!process.env.PAYCHANGU_SECRET_KEY

        return NextResponse.json({
            status: 'ok',
            user: user?.id,
            dbAccess: !dbError,
            dbError: dbError,
            hasPayChanguSecret: hasSecret
        })
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : JSON.stringify(error)
        }, { status: 500 })
    }
}
