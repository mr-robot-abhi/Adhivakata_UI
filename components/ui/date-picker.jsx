"use client"
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ selected, onSelect, ...props }) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [yearSelectOpen, setYearSelectOpen] = useState(false)
  const [monthSelectOpen, setMonthSelectOpen] = useState(false)
  const [viewDate, setViewDate] = useState(selected || new Date())

  // Generate years for selection (from 20 years ago to 5 years in the future)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 26 }, (_, i) => currentYear - 20 + i)

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

  const handleYearChange = (year) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(Number.parseInt(year))
    setViewDate(newDate)
    setYearSelectOpen(false)
  }

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(Number.parseInt(monthIndex))
    setViewDate(newDate)
    setMonthSelectOpen(false)
  }

  const handleDateSelect = (date) => {
    onSelect(date)
    setCalendarOpen(false)
  }

  function ChevronDown(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  }

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <Popover open={monthSelectOpen} onOpenChange={setMonthSelectOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="px-2 py-1 text-sm">
                  {format(viewDate, "MMMM")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <div className="max-h-60 overflow-y-auto">
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant="ghost"
                      className="w-full justify-start px-2 py-1 text-sm"
                      onClick={() => handleMonthChange(index)}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={yearSelectOpen} onOpenChange={setYearSelectOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="px-2 py-1 text-sm">
                  {format(viewDate, "yyyy")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <div className="max-h-60 overflow-y-auto">
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant="ghost"
                      className="w-full justify-start px-2 py-1 text-sm"
                      onClick={() => handleYearChange(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newDate = new Date(viewDate)
                newDate.setMonth(newDate.getMonth() - 1)
                setViewDate(newDate)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-7 px-2 py-1 text-sm"
              onClick={() => {
                setViewDate(new Date())
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newDate = new Date(viewDate)
                newDate.setMonth(newDate.getMonth() + 1)
                setViewDate(newDate)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          month={viewDate}
          onMonthChange={setViewDate}
          initialFocus
          showOutsideDays
        />
      </PopoverContent>
    </Popover>
  )
}