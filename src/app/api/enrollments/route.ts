import { fetchDerms, getServerUser } from '@/utils'

const getMeterId = async (supabase: any, user: any): Promise<string | null> => {
  const { data: meter, error } = await supabase
    .from('meters')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single()
  if (error || !meter) return null
  return meter.id
}

export async function POST(req: Request) {
  const { supabase, user } = await getServerUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { batteryId }: { batteryId?: string } = await req.json()

  const meterId = await getMeterId(supabase, user)
  if (!meterId)
    return Response.json({ message: 'NO_METER_FOUND' }, { status: 404 })

  const { data: programData, error: programError } = await fetchDerms(
    `/meters/${meterId}/programs?relation_type=ELIGIBLE&device_type=BATTERY`
  )
  if (programError) {
    console.error('Failed fetching programs on DERMS', programError)
    return Response.json({ message: 'PROGRAM_ERROR' }, { status: 500 })
  }
  if (!programData || programData.length === 0) {
    console.error('No programs found on DERMS', programData)
    return Response.json({ message: 'INELIGIBLE_NO_PROGRAM' }, { status: 404 })
  }

  const programId = programData[0]?.id

  const { data: enrollData, error: enrollError } = await fetchDerms(
    `/enrollments`,
    'POST',
    {
      meter_id: meterId,
      method: 'OPT_IN',
      program_id: programId,
      device_ids: [batteryId],
    }
  )
  if (enrollError && enrollError !== 'Enrollment already exists') {
    console.error('Failed enrolling device on DERMS', enrollError)
    return Response.json({ message: 'ENROLLMENT_FAILED' }, { status: 500 })
  }

  return Response.json(enrollData, { status: 200 })
}
