'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            Go Back
        </Button>
    )
}
