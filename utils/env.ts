/**
 * Validates that all required environment variables are present
 * Call this at app startup to fail fast if configuration is missing
 */
export function validateEnv() {
    const required = {
        // Supabase
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

        // PayChangu
        NEXT_PUBLIC_PAYCHANGU_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYCHANGU_PUBLIC_KEY,
        PAYCHANGU_SECRET_KEY: process.env.PAYCHANGU_SECRET_KEY,

        // App
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    }

    const missing: string[] = []

    for (const [key, value] of Object.entries(required)) {
        if (!value) {
            missing.push(key)
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`
        )
    }

    return true
}

// Validate immediately when this module is imported
if (typeof window === 'undefined') {
    // Only validate on server-side
    validateEnv()
}
