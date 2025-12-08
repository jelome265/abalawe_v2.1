import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-red-100 rounded-full">
                        <ShieldX className="h-16 w-16 text-red-600" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">403</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">Access Forbidden</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don&apos;t have permission to access this page. Admin privileges are required.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button variant="outline">
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/admin/login">
                        <Button>
                            Admin Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
