import { OnboardingStatus } from '@/flip-api/types'
import { Database } from '@/flip-api/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

const getUserOnboardingStatus = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<OnboardingStatus | null> => {
  const { data, error } = await supabase
    .from('user_metadata')
    .select('onboarding_status')
    .eq('id', userId)
    .limit(1)
    .single()

  return error ? null : (data.onboarding_status as OnboardingStatus)
}

export default getUserOnboardingStatus
