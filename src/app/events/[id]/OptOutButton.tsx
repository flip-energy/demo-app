'use client'

import { Button } from '@/components/ui/button'
import { fetchDermsApi } from '@/utils/fetchApi'
import { useEffect, useState } from 'react'

const OptOutButton = ({
  defaultIsParticipating,
  eventId,
}: {
  defaultIsParticipating: boolean
  eventId: string
}) => {
  const [isParticipating, setIsParticipating] = useState<boolean>(
    defaultIsParticipating
  )

  useEffect(() => {
    const updateEvent = async () => {
      await fetchDermsApi(`/events/${eventId}`, 'PATCH', {
        is_participating: isParticipating,
      })
    }
    updateEvent()
  }, [eventId, isParticipating])

  return (
    <Button
      onClick={() => {
        setIsParticipating(!isParticipating)
      }}
      variant="outline"
    >
      {isParticipating ? 'Opt out of this event' : 'Opt back in'}
    </Button>
  )
}

export default OptOutButton
