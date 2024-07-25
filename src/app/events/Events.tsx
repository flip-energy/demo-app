import EventCard from '@/components/event/Event'
import Loader from '@/components/Loader'
import PageCard from '@/components/PageCard'
import { useFlipEvents } from '@/flip-api/hooks'
import { Event, Webhook, WebhookType } from '@/flip-api/types'
import { useCurrentUser } from '@/hooks'
import { supabase } from '@/utils'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

const formatHour = (date: string) => {
  const time = new Date(date)
  const hours = time.getHours()
  const formattedHour = hours % 12 || 12 // Converts 0-23 hour format into 1-12 format
  const amPm = hours < 12 ? 'am' : 'pm'
  return `${formattedHour}${amPm}`
}

const Events = () => {
  const { user } = useCurrentUser()
  const { events, isLoading, refreshEvents } = useFlipEvents()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel(`site-${user.site_id}`)

    function handleNotification(payload: Webhook) {
      switch (payload.event_type) {
        case WebhookType.EVENT_CREATED:
          refreshEvents()
          const event = payload.event_object
          const time = formatHour(event.starts_at)
          // Get "today" if time is today, "tomorrow" if it's tomorrow, otherwise get the day of the week
          const day =
            new Date(event.starts_at).toDateString() ===
            new Date().toDateString()
              ? 'today'
              : new Date(event.starts_at).toDateString() ===
                new Date(
                  new Date().setDate(new Date().getDate() + 1)
                ).toDateString()
              ? 'tomorrow'
              : new Date(event.starts_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                })
          toast({
            title: 'New event scheduled',
            description: `Your battery will participate at ${time} ${day}.`,
          })
          break
        default:
          break
      }
    }

    // Subscribe to the Channel
    channel
      .on('broadcast', { event: 'notification' }, (payload) =>
        handleNotification(payload.payload as unknown as Webhook)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refreshEvents, toast])

  if (isLoading) return <Loader />

  if (!events || events.length === 0)
    return (
      <PageCard
        title="Your enrollment in DSGS is confirmed!"
        imgUrl={'https://picsum.photos/400/300'}
      >
        When an event is scheduled, it will appear here.
      </PageCard>
    )

  return (
    <div className="flex flex-col space-y-2">
      {events.map((event: any) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  )
}

export default Events
