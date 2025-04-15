// components/ui/calendar.tsx
import type { Locale } from "date-fns/locale"

export interface CalendarProps {
  className?: string
  classNames?: any
  showOutsideDays?: boolean
  month?: Date
  onMonthChange?: (date: Date | undefined) => void
  locale?: Pick<Locale, "options" | "localize" | "formatLong">
  showWeekNumber?: boolean
  weekStartsOn?: number
}

