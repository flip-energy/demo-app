import EventCard from '@/components/event/Event'
import Loader from '@/components/Loader'
import PageCard from '@/components/PageCard'
import { useFlipEvents } from '@/flip-api/hooks'

const Events = () => {
  const { events, isLoading } = useFlipEvents()

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
