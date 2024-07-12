const formatTime = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default formatTime
