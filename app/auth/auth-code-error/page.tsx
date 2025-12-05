'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

function AuthCodeErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    return (
        <div className="w-full max-w-md space-y-6 p-8 border rounded-lg shadow-sm bg-card">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-destructive">
                    Authentication Error
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {errorDescription || 'An error occurred during authentication'}
                </p>
                {error === 'otp_expired' && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Your verification link has expired. Please try signing up again.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <Link href="/signup">
                    <Button className="w-full">
                        Back to Sign Up
                    </Button>
                </Link>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Go to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function AuthCodeErrorPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
            <Suspense fallback={
                <div className="w-full max-w-md p-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            }>
                <AuthCodeErrorContent />
            </Suspense>
        </div>
    )
}
