import { createAdminServerSupabase } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { fetchDerms } from '@/utils'
import updateUserMetadata from '@/utils/supabase/updateUserMetadata'

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

const handleWebhook = async (payload: any) => {
  const supabaseAdmin = createAdminServerSupabase()

  switch (payload.event) {
    case 'user:battery:discovered':
      const userId = payload.user.id
      if (!userId) throw new Error('no user id on payload')
      if (!payload.battery.id) throw new Error('no battery id on payload')

      const { data: meter, error } = await supabaseAdmin
        .from('meters')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .single()
      if (meter) console.log('Meter:', meter)
      if (error) throw new Error(JSON.stringify(error))

      const { data: dermsData, error: dermsError } = await fetchDerms(
        `/devices`,
        'POST',
        {
          meter_id: meter.id,
          type: 'BATTERY',
          manufacturer_name: payload.battery.information.brand,
          product_name: payload.battery.information.model,
        }
      )
      if (dermsError) {
        console.error('failed creating device on DERMS', dermsError)
        throw new Error(JSON.stringify(dermsError))
      }

      const canExport = payload.battery.capabilities.exportFocus.isCapable

      const { data: device, error: deviceError } = await supabaseAdmin
        .from('batteries')
        .upsert(
          {
            id: dermsData.id,
            user_id: userId,
            enode_id: payload.battery.id,
            can_export: canExport,
          },
          {
            onConflict: 'user_id',
          }
        )
      if (device) console.log('Battery:', device)
      if (deviceError) throw new Error(JSON.stringify(deviceError))

      const metaError = await updateUserMetadata(
        supabaseAdmin,
        userId,
        'BATTERY_CONNECTED'
      )
      if (metaError) throw new Error(JSON.stringify(metaError))

      break
    default:
      break
  }
}

const validateWebhook = (
  secret: string,
  payload: string,
  signature: string
): boolean => {
  const hmac = crypto.createHmac('sha1', secret)
  const digest = Buffer.from(
    'sha1=' + hmac.update(payload).digest('hex'),
    'utf8'
  )
  const checksum = Buffer.from(signature, 'utf8')
  // Check whether they match, using timing-safe equality (don't use ==)
  return crypto.timingSafeEqual(digest, checksum)
}

export async function POST(req: Request) {
  const headersList = headers()
  const enodeDelivery = headersList.get('X-Enode-Delivery')
  const enodeSignature = headersList.get('X-Enode-Signature')

  if (!enodeDelivery) {
    return new Response(null, { status: 404 })
  }

  const payload = await req.json()
  const isValid = validateWebhook(
    process.env.ENODE_WEBHOOK_SECRET || '',
    JSON.stringify(payload),
    enodeSignature || ''
  )

  if (!isValid && process.env.NODE_ENV !== 'development') {
    return new Response(null, { status: 404 })
  }

  console.log('Enode webhook payload:', payload)

  // We group the payload by event and user id to dedupe when multiple batteries
  // are returned for the event and user id. THIS WILL PROBABLY BREAK FOR OTHER
  // TYPES OF DEVICES.
  const filteredPayload = payload.reduce((acc: any[], curr: any) => {
    acc[curr.event] ||= {}
    if (curr.user) {
      acc[curr.event][curr.user.id] = curr
    } else {
      acc[curr.event] = curr
    }
    return acc
  }, {})

  for (let event in filteredPayload) {
    for (let userId in filteredPayload[event]) {
      try {
        await handleWebhook(filteredPayload[event][userId])
      } catch (error: any) {
        console.error('Enode webhook error:', error)
        return Response.json({ error: error.message }, { status: 500 })
      }
    }
  }

  return new Response(null, { status: 204 })
}
