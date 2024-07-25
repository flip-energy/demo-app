import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

const createClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or key is undefined')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
const client = createClient()

export { client as supabase }
