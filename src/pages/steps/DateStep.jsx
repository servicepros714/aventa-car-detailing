import React, { useMemo, useState } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, isSameMonth, isBefore, addDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { nowPacific, formatDateKey } from '../../lib/availability'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const BOOKING_WINDOW_DAYS = 21 // matches the shared portfolio's booking-ahead window

export default function DateStep({ booking, updateBooking }) {
  const today = useMemo(() => {
    const t = nowPacific()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])
  const maxDate = useMemo(() => addDays(today, BOOKING_WINDOW_DAYS - 1), [today])

  const [viewMonth, setViewMonth] = useState(startOfMonth(today))

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(viewMonth))
    const gridEnd = endOfWeek(endOfMonth(viewMonth))
    return eachDayOfInterval({ start: gridStart, end: gridEnd })
  }, [viewMonth])

  const canGoPrev = isBefore(startOfMonth(today), startOfMonth(viewMonth))
  const canGoNext = isBefore(startOfMonth(viewMonth), startOfMonth(maxDate))

  return (
    <div className="step-date">
      <div className="calendar">
        <div className="calendar__header">
          <button
            type="button"
            className="calendar__nav"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            disabled={!canGoPrev}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="calendar__month">{format(viewMonth, 'MMMM yyyy')}</span>
          <button
            type="button"
            className="calendar__nav"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            disabled={!canGoNext}
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar__weekdays">
          {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
        </div>

        <div className="calendar__grid">
          {days.map((d) => {
            const inMonth = isSameMonth(d, viewMonth)
            const inRange = !isBefore(d, today) && !isBefore(maxDate, d)
            const key = formatDateKey(d)
            const selected = booking.date === key
            const disabled = !inMonth || !inRange

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                className={`calendar__day ${selected ? 'calendar__day--selected' : ''} ${!inMonth ? 'calendar__day--muted' : ''}`}
                onClick={() => updateBooking({ date: key, dateLabel: format(d, 'EEEE, MMMM d') })}
              >
                {format(d, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}