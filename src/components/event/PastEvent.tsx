import { formatDate } from '@/utils'
import { CheckIcon, XIcon } from 'lucide-react'
import EventCard from './EventCard'

const PastEvent = ({ event }: { event: any }) => {
  return (
    <EventCard>
      <div className="font-medium text-gray-400">
        {formatDate(new Date(event.starts_at))}
      </div>
      <div className="text-gray-400 flex items-center">
        {event.is_participating ? (
          <>
            <CheckIcon size={16} className="mr-1" />
            {event.output_kwh ? (
              <span>{event.output_kwh} kWh sent to grid</span>
            ) : (
              <span>Participated</span>
            )}
          </>
        ) : (
          <>
            <XIcon size={16} className="mr-1" />
            <span>Opted out</span>
          </>
        )}
      </div>
    </EventCard>
  )
}

export default PastEvent
