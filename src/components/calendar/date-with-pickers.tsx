"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type DatePickerView = "days" | "months" | "years"

export default function CalendarWithPickers() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [view, setView] = React.useState<DatePickerView>("days")
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  // Get current values
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Days of the week
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Navigate to previous month
  const prevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Navigate to previous year
  const prevYear = () => {
    setDate(new Date(currentYear - 1, currentMonth, 1))
  }

  // Navigate to next year
  const nextYear = () => {
    setDate(new Date(currentYear + 1, currentMonth, 1))
  }

  // Navigate to previous decade
  const prevDecade = () => {
    setDate(new Date(currentYear - 10, currentMonth, 1))
  }

  // Navigate to next decade
  const nextDecade = () => {
    setDate(new Date(currentYear + 10, currentMonth, 1))
  }

  // Select a specific month
  const selectMonth = (month: number) => {
    setDate(new Date(currentYear, month, 1))
    setView("days")
  }

  // Select a specific year
  const selectYear = (year: number) => {
    setDate(new Date(year, currentMonth, 1))
    setView("months")
  }

  // Select a specific day
  const selectDay = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
  }

  // Generate days for the current month view
  const generateDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth &&
        new Date().getFullYear() === currentYear

      days.push(
        <Button
          key={day}
          variant="ghost"
          className={`h-9 w-9 p-0 font-normal ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""} ${isToday && !isSelected ? "border border-primary" : ""}`}
          onClick={() => selectDay(day)}
        >
          {day}
        </Button>,
      )
    }

    return days
  }

  // Generate months for the month selection view
  const generateMonths = () => {
    return months.map((month, index) => {
      const isSelected = selectedDate && selectedDate.getMonth() === index && selectedDate.getFullYear() === currentYear

      const isCurrentMonth = new Date().getMonth() === index && new Date().getFullYear() === currentYear

      return (
        <Button
          key={month}
          variant="ghost"
          className={`h-[70px] font-normal ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""} ${isCurrentMonth && !isSelected ? "border border-primary" : ""}`}
          onClick={() => selectMonth(index)}
        >
          {month}
        </Button>
      )
    })
  }

  // Generate years for the year selection view
  const generateYears = () => {
    const startYear = Math.floor(currentYear / 10) * 10 - 1
    const years = []

    for (let i = 0; i < 12; i++) {
      const year = startYear + i
      const isSelected = selectedDate && selectedDate.getFullYear() === year
      const isCurrentYear = new Date().getFullYear() === year

      years.push(
        <Button
          key={year}
          variant="ghost"
          className={`h-[70px] font-normal ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""} ${isCurrentYear && !isSelected ? "border border-primary" : ""}`}
          onClick={() => selectYear(year)}
        >
          {year}
        </Button>,
      )
    }

    return years
  }

  // Render the header based on current view
  const renderHeader = () => {
    if (view === "days") {
      return (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="h-7 w-7 p-0" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex space-x-1">
            <Button variant="ghost" onClick={() => setView("months")} className="text-sm font-medium">
              {months[currentMonth]}
            </Button>
            <Button variant="ghost" onClick={() => setView("years")} className="text-sm font-medium">
              {currentYear}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-7 w-7 p-0" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )
    } else if (view === "months") {
      return (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevYear} className="h-7 w-7 p-0" aria-label="Previous year">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => setView("years")} className="text-sm font-medium">
            {currentYear}
          </Button>
          <Button variant="ghost" size="sm" onClick={nextYear} className="h-7 w-7 p-0" aria-label="Next year">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )
    } else {
      const startYear = Math.floor(currentYear / 10) * 10
      const endYear = startYear + 9

      return (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevDecade} className="h-7 w-7 p-0" aria-label="Previous decade">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            {startYear} - {endYear}
          </Button>
          <Button variant="ghost" size="sm" onClick={nextDecade} className="h-7 w-7 p-0" aria-label="Next decade">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }

  // Render the content based on current view
  const renderContent = () => {
    if (view === "days") {
      return (
        <div>
          <div className="mb-1 grid grid-cols-7 text-center text-xs">
            {weekdays.map((day) => (
              <div key={day} className="h-9 w-9 font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center">{generateDays()}</div>
        </div>
      )
    } else if (view === "months") {
      return <div className="grid grid-cols-3 gap-2 p-2">{generateMonths()}</div>
    } else {
      return <div className="grid grid-cols-3 gap-2 p-2">{generateYears()}</div>
    }
  }

  return (
    <Card className="w-[320px] mx-auto">
      <CardContent className="p-3">
        <div className="space-y-4">
          {renderHeader()}
          {renderContent()}

          {selectedDate && <div className="pt-4 text-sm">Selected: {selectedDate.toLocaleDateString()}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

