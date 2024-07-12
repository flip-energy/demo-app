import { Database } from '@/flip-api/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

const updateUserMetadata = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  onboarding_status: string
) => {
  const { data, error } = await supabase.from('user_metadata').upsert(
    {
      id: userId,
      onboarding_status,
    },
    { onConflict: 'id' }
  )

  return error ? error : null
}

export default updateUserMetadata
