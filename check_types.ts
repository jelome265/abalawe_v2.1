
import { createClient } from '@supabase/supabase-js'
import { Database } from './types/database.types'

// Example function for type checking - can be used for testing
export async function testDatabaseTypes() {
    const client = createClient<Database>('url', 'key')
    const { data: profile } = await client.from('profiles').select('*').single()

    if (profile) {
        console.log(profile.role)
        console.log(profile.id)
    }

    const { data: order } = await client.from('orders').select('*').single()
    if (order) {
        console.log(order.total_amount)
    }
}
