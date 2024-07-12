const now = new Date()
const currentEventStart = new Date(now.getTime() - 11 * 60 * 1000)
const upcomignEventStart = new Date(now.getTime() + 24 * 60 * 60 * 1000)
const events = [
  {
    id: '1',
    is_participating: true,
    is_optional: false,
    event: {
      starts_at: currentEventStart.toISOString(),
      ends_at: new Date(
        currentEventStart.getTime() + 120 * 60 * 1000
      ).toISOString(),
      is_test: false,
    },
  },
  {
    id: '2',
    is_participating: true,
    is_optional: false,
    event: {
      starts_at: upcomignEventStart.toISOString(),
      ends_at: new Date(
        upcomignEventStart.getTime() + 120 * 60 * 1000
      ).toISOString(),
      is_test: false,
    },
  },
]
export default events
