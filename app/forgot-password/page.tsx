'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/callback?next=/dashboard/reset-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                setIsSubmitted(true)
                toast.success('Password reset email sent!')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
                <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-sm bg-card relative">
                    <div className="absolute top-4 left-4">
                        <BackButton />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                        <p className="text-muted-foreground mt-4">
                            We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Please check your inbox and spam folder.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
            <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-sm bg-card relative">
                <div className="absolute top-4 left-4">
                    <BackButton />
                </div>
                <div className="text-center mt-8">
                    <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
