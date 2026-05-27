export function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false

  const date = new Date(`${value}T00:00:00.000Z`)
  return date.toISOString().slice(0, 10) === value
}

export function isValidMonthString(value) {
  return /^\d{4}-\d{2}$/.test(value || '')
}

export function getNextMonthString(month) {
  const [year, monthIndex] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, monthIndex, 1))
  return date.toISOString().slice(0, 7)
}
