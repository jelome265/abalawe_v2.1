'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            setIsLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    const handleMagicLink = async () => {
        setIsLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email for the magic link!')
        }
        setIsLoading(false)
    }

    const handleSignUp = async () => {
        setIsLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email to confirm your account!')
        }
        setIsLoading(false)
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
            <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-sm bg-card">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {message && (
                        <div className="p-3 text-sm text-center rounded-md bg-muted text-muted-foreground">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign In'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleMagicLink} disabled={isLoading || !email}>
                        Magic Link
                    </Button>
                    <Button variant="outline" onClick={handleSignUp} disabled={isLoading || !email || !password}>
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    )
}
