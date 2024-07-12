const getEventStatus = (event: any) => {
  const now = new Date()
  const startsAt = new Date(event.starts_at)
  const endsAt = new Date(event.ends_at)
  if (now < startsAt) return 'scheduled'
  if (now > startsAt && now < endsAt) return 'active'
  return 'past'
}

export default getEventStatus
