import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const uploadSchema = z.object({
    filename: z.string().min(1),
    contentType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/, 'Invalid image type'),
    size: z.number().max(5 * 1024 * 1024, 'File size too large (max 5MB)'),
})

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { filename, contentType, size } = uploadSchema.parse(body)

        // Generate a unique path
        const path = `${user.id}/${Date.now()}-${filename}`

        const { data, error } = await supabase
            .storage
            .from('products') // Ensure this bucket exists in Supabase
            .createSignedUploadUrl(path)

        if (error) {
            throw error
        }

        return NextResponse.json({
            url: data.signedUrl,
            path: data.path,
            token: data.token,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 })
        }
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
