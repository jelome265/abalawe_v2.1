import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually read .env.local since dotenv is not installed
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
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable(tableName: string) {
    console.log(`Checking table: ${tableName}...`)
    const { data, error } = await supabase.from(tableName).select('*').limit(1)
    if (error) {
        console.error(`❌ Error accessing ${tableName}:`, error.message)
    } else {
        console.log(`✅ Success accessing ${tableName}. Found ${data.length} rows.`)
    }
}

async function main() {
    console.log('Verifying Database Connection and Tables...')
    console.log('URL:', supabaseUrl)
    // console.log('Key:', supabaseKey) // Don't log key

    await checkTable('products')
    await checkTable('profiles')
    await checkTable('orders')
}

main()
