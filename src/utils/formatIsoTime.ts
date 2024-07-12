import formatTime from './formatTime'
import formatDate from './formatDate'

const formatIsoTime = (isoTimeStart: string, isoTimeEnd?: string) => {
  const dateStart = new Date(isoTimeStart)

  const formattedDate = formatDate(dateStart)
  const formattedStartTime = formatTime(dateStart)
  const formattedEndTime = isoTimeEnd ? formatTime(new Date(isoTimeEnd)) : null

  return `${formattedDate}, ${formattedStartTime}${
    formattedEndTime ? ` - ${formattedEndTime}` : ''
  }`
}

export default formatIsoTime
