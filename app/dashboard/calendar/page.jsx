"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, MapPin, Users, Edit, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { api, fetchCases } from "@/lib/api"

// Event types aligned with backend EventSchema
const EVENT_TYPES = [
  { value: "hearing", label: "Court Hearing", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "client_meeting", label: "Client Meeting", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "case_filing", label: "Case Filing", color: "bg-red-100 text-red-800 border-red-300" },
  { value: "evidence_submission", label: "Evidence Submission", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "court_visit", label: "Court Visit", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "mediation", label: "Mediation", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { value: "arbitration", label: "Arbitration", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { value: "judgment", label: "Judgment", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { value: "appeal", label: "Appeal", color: "bg-gray-100 text-gray-800 border-gray-300" },
]

export default function CalendarPage() {
  const { user } = useAuth()
  const [isLawyer, setIsLawyer] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [viewMode, setViewMode] = useState("month")
  const [cases, setCases] = useState([]) // Store fetched cases
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    time: "",
    type: "hearing",
    location: "",
    description: "",
    case: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    // Check if user is lawyer or client
    if (user) {
      setIsLawyer(user.role === "lawyer")
    }
  }, [user])

  // Fetch cases from backend
  useEffect(() => {
    const loadCases = async () => {
      try {
        const fetchedCases = await fetchCases()
        setCases(fetchedCases)
      } catch (error) {
        console.error("Error fetching cases:", error)
        toast({
          title: "Error fetching cases",
          description: "Failed to load cases. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadCases()
  }, [])

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, date: null })
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dateString = date.toISOString().split("T")[0]
    const dayEvents = events.filter((event) => event.date === dateString)

    calendarDays.push({
      day,
      date,
      dateString,
      events: dayEvents,
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Handle new event form changes
  const handleNewEventChange = (field, value) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }))
  }

  // Handle date selection for new event
  const handleDateSelect = (date) => {
    setNewEvent((prev) => ({ ...prev, date }))
  }

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await api.events.getAll()
      if (response && response.data) {
        const formattedEvents = response.data.map((event) => ({
          id: event._id || event.id,
          title: event.title,
          date: event.start ? new Date(event.start).toISOString().split("T")[0] : null,
          time: event.start
            ? new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : null,
          type: event.type || "hearing",
          location: event.location || "",
          description: event.description || "",
          case: event.case?.title || "",
          caseId: event.case?._id || "",
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Validate time format (e.g., "10:30 AM")
  const isValidTime = (timeStr) => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i
    return timeRegex.test(timeStr.trim())
  }

  // Add new event
  const addEvent = async () => {
    try {
      // Validate inputs
      if (!newEvent.title) {
        toast({
          title: "Missing title",
          description: "Please provide a title for the event.",
          variant: "destructive",
        })
        return
      }

      if (!(newEvent.date instanceof Date) || isNaN(newEvent.date)) {
        toast({
          title: "Invalid date",
          description: "Please select a valid date.",
          variant: "destructive",
        })
        return
      }

      if (!newEvent.time || !isValidTime(newEvent.time)) {
        toast({
          title: "Invalid time",
          description: "Please provide a valid time (e.g., 10:30 AM).",
          variant: "destructive",
        })
        return
      }

      if (newEvent.type !== "client_meeting" && (!newEvent.case || newEvent.case === "none")) {
        toast({
          title: "Missing case",
          description: "Please select a case for this event type.",
          variant: "destructive",
        })
        return
      }

      const startTime = combineDateAndTime(newEvent.date, newEvent.time)
      const now = new Date()
      if (startTime <= now) {
        toast({
          title: "Invalid start time",
          description: "Event start time must be in the future.",
          variant: "destructive",
        })
        return
      }

      const apiEvent = {
        title: newEvent.title,
        case: newEvent.case === "none" ? undefined : newEvent.case,
        start: startTime.toISOString(),
        end: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        type: newEvent.type,
        location: newEvent.location,
        description: newEvent.description,
      }

      // Log the payload for debugging
      console.log("Sending event payload:", apiEvent)

      const response = await api.events.create(apiEvent)
      const dateString = newEvent.date.toISOString().split("T")[0]
      const newEventObj = {
        id: response._id || response.id || `event-${Date.now()}`,
        ...newEvent,
        date: dateString,
        caseId: newEvent.case,
        case: newEvent.case === "none" ? "" : cases.find((c) => c._id === newEvent.case)?.title || "",
      }

      setEvents((prev) => [...prev, newEventObj])
      setNewEvent({
        title: "",
        date: new Date(),
        time: "",
        type: "hearing",
        location: "",
        description: "",
        case: "",
      })
      setIsDialogOpen(false)
      toast({
        title: "Event created",
        description: "Your event has been added to the calendar.",
      })
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error creating event",
        description: error.message || "There was an error creating the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to combine date and time
  const combineDateAndTime = (date, timeStr) => {
    if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("Invalid date provided")
    }

    const result = new Date(date)
    if (!timeStr || !isValidTime(timeStr)) {
      throw new Error("Invalid time format. Use HH:MM AM/PM (e.g., 10:30 AM)")
    }

    const [timePart, ampm] = timeStr.trim().split(" ")
    const [hours, minutes] = timePart.split(":").map(Number)

    if (ampm.toUpperCase() === "PM" && hours < 12) {
      result.setHours(hours + 12, minutes, 0, 0)
    } else if (ampm.toUpperCase() === "AM" && hours === 12) {
      result.setHours(0, minutes, 0, 0)
    } else {
      result.setHours(hours, minutes, 0, 0)
    }

    return result
  }

  // Update event
  const updateEvent = async () => {
    if (!selectedEvent) return
    try {
      // Validate inputs
      if (!newEvent.title) {
        toast({
          title: "Missing title",
          description: "Please provide a title for the event.",
          variant: "destructive",
        })
        return
      }

      if (!(newEvent.date instanceof Date) || isNaN(newEvent.date)) {
        toast({
          title: "Invalid date",
          description: "Please select a valid date.",
          variant: "destructive",
        })
        return
      }

      if (!newEvent.time || !isValidTime(newEvent.time)) {
        toast({
          title: "Invalid time",
          description: "Please provide a valid time (e.g., 10:30 AM).",
          variant: "destructive",
        })
        return
      }

      if (newEvent.type !== "client_meeting" && (!newEvent.case || newEvent.case === "none")) {
        toast({
          title: "Missing case",
          description: "Please select a case for this event type.",
          variant: "destructive",
        })
        return
      }

      const startTime = combineDateAndTime(newEvent.date, newEvent.time)
      const now = new Date()
      if (startTime <= now) {
        toast({
          title: "Invalid start time",
          description: "Event start time must be in the future.",
          variant: "destructive",
        })
        return
      }

      const apiEvent = {
        title: newEvent.title,
        case: newEvent.case === "none" ? undefined : newEvent.case,
        start: startTime.toISOString(),
        end: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        type: newEvent.type,
        location: newEvent.location,
        description: newEvent.description,
      }

      // Log the payload for debugging
      console.log("Updating event payload:", apiEvent)

      await api.events.update(selectedEvent.id, apiEvent)
      const dateString = newEvent.date.toISOString().split("T")[0]
      const updatedEvent = {
        ...selectedEvent,
        ...newEvent,
        date: dateString,
        caseId: newEvent.case,
        case: newEvent.case === "none" ? "" : cases.find((c) => c._id === newEvent.case)?.title || "",
      }

      setEvents((prev) => prev.map((event) => (event.id === selectedEvent.id ? updatedEvent : event)))
      setSelectedEvent(null)
      setNewEvent({
        title: "",
        date: new Date(),
        time: "",
        type: "hearing",
        location: "",
        description: "",
        case: "",
      })
      setIsDialogOpen(false)
      setIsEditMode(false)
      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error updating event",
        description: "There was an error updating the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete event
  const deleteEvent = async () => {
    if (!selectedEvent) return
    try {
      await api.events.delete(selectedEvent.id)
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id))
      setSelectedEvent(null)
      setShowDeleteDialog(false)
      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error deleting event",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Edit event
  const editEvent = (event) => {
    setSelectedEvent(event)
    setNewEvent({
      title: event.title,
      date: new Date(event.date),
      time: event.time || "",
      type: event.type || "hearing",
      location: event.location || "",
      description: event.description || "",
      case: event.caseId || "",
    })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  // Get month name
  const monthNames = [
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

  // Get day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get event color based on type
  const getEventColor = (type) => {
    const eventType = EVENT_TYPES.find((t) => t.value === type)
    return eventType ? eventType.color : "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Update the event details" : "Create a new event on your calendar"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => handleNewEventChange("title", e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker id="date" selected={newEvent.date} onSelect={handleDateSelect} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => handleNewEventChange("time", e.target.value)}
                      placeholder="e.g. 10:30 AM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => handleNewEventChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="case">Related Case</Label>
                    <Select value={newEvent.case} onValueChange={(value) => handleNewEventChange("case", value)}>
                      <SelectTrigger id="case">
                        <SelectValue placeholder="Select case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled={newEvent.type !== "client_meeting"}>
                          None
                        </SelectItem>
                        {cases.map((caseItem) => (
                          <SelectItem key={caseItem._id} value={caseItem._id}>
                            {caseItem.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => handleNewEventChange("location", e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => handleNewEventChange("description", e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                {isEditMode && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteDialog(true)
                      setIsDialogOpen(false)
                    }}
                    className="mr-auto"
                  >
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setIsEditMode(false)
                    setSelectedEvent(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={isEditMode ? updateEvent : addEvent} disabled={!newEvent.title || !newEvent.date}>
                  {isEditMode ? "Update Event" : "Add Event"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-bold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div key={day} className="text-center font-medium py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] border rounded-md p-1 ${
                      day.day === null
                        ? "bg-muted/20"
                        : day.dateString === new Date().toISOString().split("T")[0]
                          ? "bg-primary/10 border-primary"
                          : ""
                    }`}
                  >
                    {day.day !== null && (
                      <>
                        <div className="flex justify-between items-center p-1">
                          <div className="text-sm font-medium">{day.day}</div>
                          {isLawyer && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100"
                              onClick={() => {
                                setNewEvent((prev) => ({
                                  ...prev,
                                  date: day.date,
                                }))
                                setIsDialogOpen(true)
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {day.events && day.events.length > 0
                            ? day.events.map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded border truncate cursor-pointer ${getEventColor(event.type)}`}
                                  title={event.title}
                                  onClick={() => (isLawyer ? editEvent(event) : null)}
                                >
                                  {event.time && `${event.time} - `}
                                  {event.title}
                                </div>
                              ))
                            : null}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter((event) => {
                    const eventDate = new Date(event.date)
                    const today = new Date()
                    const nextWeek = new Date()
                    nextWeek.setDate(today.getDate() + 7)
                    return eventDate >= today && eventDate <= nextWeek
                  })
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event) => (
                    <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{event.title}</h3>
                        {isLawyer && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editEvent(event)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEvent(event)
                                  setShowDeleteDialog(true)
                                }}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-2" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.case && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-2" />
                            <span>{event.case}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                {events.filter((event) => {
                  const eventDate = new Date(event.date)
                  const today = new Date()
                  const nextWeek = new Date()
                  nextWeek.setDate(today.getDate() + 7)
                  return eventDate >= today && eventDate <= nextWeek
                }).length === 0 && (
                  <div className="text-center py-6">
                    <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Calendar Tips</CardTitle>
              <CardDescription>Make the most of your schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full">
                <Image src="/images/bg_3.jpg" alt="Scales of justice" fill className="object-cover rounded-md" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Scheduling Best Practices</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Schedule court dates as soon as they're confirmed</li>
                  <li>Block preparation time before hearings</li>
                  <li>Set reminders for filing deadlines</li>
                  <li>Color-code events by type for easy recognition</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEvent && (
              <div className={`p-3 rounded-lg border ${getEventColor(selectedEvent.type)}`}>
                <h3 className="font-medium">{selectedEvent.title}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-2" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  {selectedEvent.time && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}