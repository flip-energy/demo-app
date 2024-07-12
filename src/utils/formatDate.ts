const formatDate = (date: Date) => {
  const now = new Date()
  return date.toLocaleDateString([], {
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    month: 'long',
    day: 'numeric',
  })
}

export default formatDate
