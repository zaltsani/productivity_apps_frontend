"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PickerView = "months" | "years"

export default function MonthYearPicker({ date, setDate }) {
  // const [date, setDate] = React.useState<Date>(new Date())
  const [view, setView] = React.useState<PickerView>("months")
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear())

  React.useEffect(() => {
    // setDate(date.setMonth(selectedMonth))
  }, [selectedMonth, selectedYear])

  // Get current year
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

  // Navigate to previous year
  const prevYear = () => {
    setDate(new Date(currentYear - 1, date.getMonth(), 1))
  }

  // Navigate to next year
  const nextYear = () => {
    setDate(new Date(currentYear + 1, date.getMonth(), 1))
  }

  // Navigate to previous decade
  const prevDecade = () => {
    setDate(new Date(currentYear - 10, date.getMonth(), 1))
  }

  // Navigate to next decade
  const nextDecade = () => {
    setDate(new Date(currentYear + 10, date.getMonth(), 1))
  }

  // Select a specific month
  const selectMonth = (month: number) => {
    setSelectedMonth(month)
    setSelectedYear(currentYear)
    setDate(new Date(date.getFullYear(), month, 1))
  }

  // Select a specific year
  const selectYear = (year: number) => {
    setSelectedYear(year)
    setDate(new Date(year, date.getMonth(), 1))
    setView("months")
  }

  // Generate months for the month selection view
  const generateMonths = () => {
    return months.map((month, index) => {
      const isSelected = selectedMonth === index && selectedYear === currentYear
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
      const isSelected = selectedYear === year
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
    if (view === "months") {
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
    if (view === "months") {
      return <div className="grid grid-cols-3 gap-2 p-2">{generateMonths()}</div>
    } else {
      return <div className="grid grid-cols-3 gap-2 p-2">{generateYears()}</div>
    }
  }

  return (
    <Card className="w-[320px] mx-auto pt-0 shadow-lg">
      <CardHeader className="py-4 pb-2">
        <CardTitle className="text-center text-lg">{months[selectedMonth]} {selectedYear}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-0">
          {renderHeader()}
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  )
}

