import { Database } from '@/flip-api/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

const getMeter = async (supabase: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await supabase
    .from('meters')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
    .single()

  return error ? null : data
}

export default getMeter
