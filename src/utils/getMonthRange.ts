const getMonthRange = (months: number[]): string => {
  // months is an array of numbers representings months from 1 to 12
  // the output is a string with the full name of the months separated by commas
  // if the months follow each other, the output is a range
  if (months.length === 0) {
    return 'None'
  }
  if (months.length === 12) {
    return 'Year-round'
  }

  const monthsNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  let result = ''
  let rangeStart = months[0]
  let rangeEnd = months[0]
  for (let i = 1; i < months.length; i++) {
    if (months[i] === months[i - 1] + 1) {
      rangeEnd = months[i]
    } else {
      if (rangeStart === rangeEnd) {
        result += monthsNames[rangeStart - 1] + ', '
      } else {
        result +=
          monthsNames[rangeStart - 1] +
          ' to ' +
          monthsNames[rangeEnd - 1] +
          ', '
      }
      rangeStart = months[i]
      rangeEnd = months[i]
    }
  }
  if (rangeStart === rangeEnd) {
    result += monthsNames[rangeStart - 1]
  } else {
    result += monthsNames[rangeStart - 1] + ' to ' + monthsNames[rangeEnd - 1]
  }
  return result
}

export default getMonthRange
