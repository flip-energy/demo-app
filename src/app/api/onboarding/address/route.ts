export const maxDuration = 300 // This function can run for a maximum of 300 seconds

import { Address, OnboardingStatus } from '@/flip-api/types'
import { fetchDerms, getServerUser } from '@/utils'
import updateUserMetadata from '@/utils/supabase/updateUserMetadata'

export async function POST(req: Request) {
  const { supabase, user } = await getServerUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { address }: { address?: Address } = await req.json()
  if (!address)
    return Response.json({ error: 'Address is required' }, { status: 406 })

  try {
    const { data: meter, error } = await fetchDerms('/meters', 'POST', address)

    if (error) {
      // TODO: handle error
      console.error('failed request', meter)
      return Response.json(error, { status: 503 })
    }
    if (!meter.utility || !meter.utility.id) {
      // TODO: handle error
      console.error('could not find a utility for address', meter)
      return Response.json(
        { message: OnboardingStatus.INELIGIBLE_NO_UTILITY },
        { status: 406 }
      )
    }

    // Save the ID into the local DB and associate with user for future retrieval
    const { error: meterError } = await supabase.from('meters').upsert(
      {
        id: meter.id,
        user_id: user.id,
      },
      {
        onConflict: 'user_id',
      }
    )

    if (meterError) {
      console.error('failed supabase request', meterError)
      return Response.json(meterError, { status: 503 })
    }

    const { data: programData, error: programError } = await fetchDerms(
      `/meters/${meter.id}/programs?relation_type=ELIGIBLE&device_type=BATTERY`
    )
    if (programError) {
      console.error('Failed fetching programs on DERMS', programError)
      return Response.json({ message: 'PROGRAM_ERROR' }, { status: 500 })
    }
    if (!programData || programData.length === 0) {
      console.error('No programs found on DERMS', programData)
      return Response.json(
        { message: OnboardingStatus.INELIGIBLE_NO_PROGRAM },
        { status: 406 }
      )
    }

    const metaError = await updateUserMetadata(
      supabase,
      user.id,
      OnboardingStatus.METER_CREATED
    )
  } catch (e: any) {
    // TODO: handle error
    console.error('failed request', e)
    return Response.json({ error: e.message }, { status: 503 })
  }

  return Response.json(address, { status: 200 })
}
