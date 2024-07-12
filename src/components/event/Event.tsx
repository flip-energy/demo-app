import Link from 'next/link'
import ActiveEvent from './ActiveEvent'
import { EventStatus } from '@/flip-api/types'
import PastEvent from './PastEvent'
import ScheduledEvent from './ScheduledEvent'

const Event = ({ event }: { event: any }) => {
  const renderEvent = (event: any) => {
    switch (event.status) {
      case EventStatus.UPCOMING:
        return <ScheduledEvent event={event} />
      case EventStatus.ACTIVE:
        return <ActiveEvent event={event} />
      case EventStatus.COMPLETED:
        return <PastEvent event={event} />
      default:
        return null
    }
  }

  return <Link href={`/events/${event.id}`}>{renderEvent(event)}</Link>
}

export default Event
