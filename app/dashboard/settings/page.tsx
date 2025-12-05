'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [fullName, setFullName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .single() as { data: any, error: any }

            if (data) {
                setProfile(data)
                setFullName(data.full_name || '')
            }
            setIsLoading(false)
        }

        getProfile()
    }, [supabase, router])

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)

        const { error } = await (supabase
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .from('profiles') as any)
            .update({
                full_name: fullName,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile?.id as string)

        if (error) {
            setMessage('Error updating profile')
        } else {
            setMessage('Profile updated successfully')
            router.refresh()
        }
        setIsSaving(false)
    }

    if (isLoading) {
        return <div className="container py-12">Loading settings...</div>
    }

    return (
        <div className="container px-4 md:px-6 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

            <div className="space-y-8">
                <div className="rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="text"
                                value={profile?.email || ''}
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        {message && (
                            <div className="text-sm text-green-600 font-medium">
                                {message}
                            </div>
                        )}

                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </div>

                <div className="rounded-lg border p-6 border-destructive/20 bg-destructive/5">
                    <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all of your content.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </div>
        </div>
    )
}
