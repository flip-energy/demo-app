import { formatIsoTime } from '@/utils'
import { CalendarIcon } from 'lucide-react'
import EventCard from './EventCard'

const ScheduledEvent = ({ event }: { event: any }) => {
  return (
    <EventCard>
      <div className="font-medium">{formatIsoTime(event.starts_at)}</div>
      <div className="text-gray-400 flex items-center">
        <CalendarIcon size={16} className="mr-1" />
        <span>Scheduled</span>
      </div>
    </EventCard>
  )
}

export default ScheduledEvent
