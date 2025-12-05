import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        envVars[key.trim()] = value.trim()
    }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectTable(tableName: string) {
    console.log(`\n--- Inspecting ${tableName} ---`)

    // We can't easily query information_schema with supabase-js client unless we have a function for it
    // or if we have direct SQL access.
    // However, we can try to insert a dummy row and see the error, OR just try to select and see the structure if data exists.
    // But since we suspect schema mismatch, let's try to call a postgres function if possible, or just deduce from error.

    // Actually, we can try to select from information_schema via RPC if enabled, but usually not.
    // Let's try to insert a row into profiles with a random ID and see what happens.
    // Note: We can't insert into profiles easily because of the foreign key constraint to auth.users.

    // Alternative: Try to select * from profiles limit 1 and print the keys.
    const { data, error } = await supabase.from(tableName).select('*').limit(1)

    if (error) {
        console.error('Error selecting:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Columns found in existing row:', Object.keys(data[0]))
    } else {
        console.log('Table is empty or no read access. Cannot infer columns from data.')
        // If empty, we can't see columns via select *.
    }
}

async function main() {
    await inspectTable('profiles')
}

main()
