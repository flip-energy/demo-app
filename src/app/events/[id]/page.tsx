'use client'

import Loader from '@/components/Loader'
import EventForm from './Form'
import PageHeader from '@/components/PageHeader'
import { useFlipDevice, useFlipEvent } from '@/flip-api/hooks'
import { withLoggedInLayout } from '@/app/LoggedInLayout'
import { formatIsoTime, formatTime } from '@/utils'
import { BatteryMode, EventScheduleItem, EventStatus } from '@/flip-api/types'
import Block from '@/components/Block'

const formatAction = (mode: BatteryMode): string => {
  switch (mode) {
    case BatteryMode.BACKUP:
      return 'Enter backup mode'
    case BatteryMode.CHARGE:
      return 'Start charging'
    case BatteryMode.DISCHARGE:
      return 'Start discharging'
    case BatteryMode.SAVINGS:
      return 'Standby'
    case BatteryMode.SELF_CONSUMPTION:
      return 'Enter self-consumption mode'
    case BatteryMode.STANDBY:
      return 'Enter savings maximization mode'
    default:
      return 'Unknown action'
  }
}

const Status = ({
  status,
  isParticipating,
}: {
  status: string
  isParticipating: boolean
}) => {
  switch (status) {
    case EventStatus.UPCOMING:
      return (
        <>Upcoming &middot; {isParticipating ? 'Participating' : 'Opted out'}</>
      )
    case EventStatus.ACTIVE:
      return (
        <>Active &middot; {isParticipating ? 'Participating' : 'Opted out'}</>
      )
    case EventStatus.COMPLETED:
      return (
        <>
          {isParticipating ? (
            <>Past &middot; Participated</>
          ) : (
            <>Past &middot; Opted out</>
          )}
        </>
      )
    default:
      return null
  }
}

const EventPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params
  const { event, isLoading: isEventLoading } = useFlipEvent(id)
  const { device, isLoading: isDeviceLoading } = useFlipDevice(
    event?.device_settings?.[0].device_id
  )

  if (isEventLoading || isDeviceLoading) return <Loader />

  if (!event) return null

  const defaultReserve = device?.configuration?.reserve_percentage || null

  return (
    <>
      <PageHeader title="Event details" backTo="/" />
      <div className="w-full flex flex-col space-y-3 mb-3">
        <Block
          label="Status"
          value={
            <Status
              status={event.status}
              isParticipating={event.is_participating}
            />
          }
        />
        <Block label="Start" value={formatIsoTime(event.starts_at)} />
        {event.ends_at && (
          <Block label="End" value={formatIsoTime(event.ends_at)} />
        )}
        <Block
          label="Schedule"
          value={
            <div className="flex flex-col">
              {event.schedule.map((scheduleItem: EventScheduleItem) => (
                <div
                  className="flex flex-row"
                  key={`${scheduleItem.starts_at}`}
                >
                  <div className="flex w-1/4 mr-2">
                    {formatTime(scheduleItem.starts_at)}
                  </div>
                  <div className="flex w-3/4">
                    {formatAction(scheduleItem.mode)}
                  </div>
                </div>
              ))}
              {event.ends_at && (
                <div className="flex flex-row">
                  <div className="flex w-1/4 mr-2">
                    {formatTime(event.ends_at)}
                  </div>
                  <div className="flex w-3/4">Return to normal operations</div>
                </div>
              )}
            </div>
          }
        />
      </div>
      {event &&
        (event.ends_at === null || new Date(event.ends_at) > new Date()) && (
          <EventForm event={event} defaultReserve={defaultReserve} />
        )}
    </>
  )
}

export default withLoggedInLayout(EventPage)
