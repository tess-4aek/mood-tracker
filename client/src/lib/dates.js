export function toDateStringLocal(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toMonthStringLocal(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatHumanDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function getMonthTitle(monthString) {
  const date = new Date(`${monthString}-01T00:00:00`)
  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function shiftMonth(monthString, shift) {
  const [year, month] = monthString.split('-').map(Number)
  const date = new Date(year, month - 1 + shift, 1)
  return toMonthStringLocal(date)
}

export function buildMonthGrid(monthString) {
  const [year, month] = monthString.split('-').map(Number)
  const firstDate = new Date(year, month - 1, 1)
  const lastDate = new Date(year, month, 0)

  const mondayBasedStart = (firstDate.getDay() + 6) % 7
  const totalCells = Math.ceil((mondayBasedStart + lastDate.getDate()) / 7) * 7
  const cells = []

  for (let i = 0; i < totalCells; i += 1) {
    const dayNumber = i - mondayBasedStart + 1
    const date = new Date(year, month - 1, dayNumber)
    const isCurrentMonth = date.getMonth() === month - 1

    cells.push({
      dateString: toDateStringLocal(date),
      day: date.getDate(),
      isCurrentMonth,
      isToday: toDateStringLocal(date) === toDateStringLocal(new Date())
    })
  }

  return cells
}
