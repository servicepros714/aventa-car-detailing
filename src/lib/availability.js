import { addDays, format, isBefore, startOfDay } from 'date-fns'

// 30-minute slots, 7:00 AM – 7:00 PM (last slot starts 6:30 PM)
const START_HOUR = 7
const END_HOUR = 19 // 7:00 PM

export const TIME_SLOTS = (() => {
  const slots = []
  let h = START_HOUR, m = 0
  while (h < END_HOUR || (h === END_HOUR && m === 0)) {
    const hour12 = h % 12 === 0 ? 12 : h % 12
    const ampm = h < 12 ? 'AM' : 'PM'
    slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${ampm}`)
    m += 30
    if (m === 60) { m = 0; h += 1 }
  }
  return slots
})()

/** Returns the current date/time in Pacific, for availability logic. */
export function nowPacific() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
}

/** Next N bookable dates (today included if not yet past close), Pacific Time. */
export function getBookableDates(count = 21) {
  const today = startOfDay(nowPacific())
  const dates = []
  let cursor = today
  while (dates.length < count) {
    dates.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return dates
}

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

export function isSlotInPast(dateKey, slotLabel) {
  const today = nowPacific()
  const todayKey = formatDateKey(today)
  if (dateKey !== todayKey) return isBefore(new Date(dateKey), startOfDay(today))
  const [time, ampm] = slotLabel.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  const slotDate = new Date(today)
  slotDate.setHours(h, m, 0, 0)
  return isBefore(slotDate, today)
}
