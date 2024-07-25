import { Webhook, WebhookType } from '@/flip-api/types'
import { createAdminServerSupabase } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const data = (await req.json()) as Webhook
  const supabase = createAdminServerSupabase()

  switch (data.event_type) {
    case WebhookType.EVENT_CREATED:
    case WebhookType.ENROLLMENT_UPDATED:
      const channel = supabase.channel(`site-${data.event_object.site_id}`)

      channel.subscribe((status) => {
        // Wait for successful connection
        if (status !== 'SUBSCRIBED') {
          return null
        }

        // Send a message once the client is subscribed
        channel.send({
          type: 'broadcast',
          event: 'notification',
          payload: data,
        })
      })

      break
    default:
      break
  }

  return new Response(null, { status: 204 })
}
