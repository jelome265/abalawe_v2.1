import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 10 // requests
const WINDOW_MS = 60 * 1000 // 1 minute

export function rateLimit(identifier: string): boolean {
    const now = Date.now()
    const record = requestCounts.get(identifier)

    if (!record || now > record.resetTime) {
        requestCounts.set(identifier, { count: 1, resetTime: now + WINDOW_MS })
        return true
    }

    if (record.count >= RATE_LIMIT) {
        return false
    }

    record.count++
    return true
}

export function rateLimitMiddleware(req: NextRequest) {
    // Use IP address as identifier
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    if (!rateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        )
    }

    return null // Continue processing
}
