"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, FileTextIcon, BarChart3Icon, ClockIcon, AlertCircleIcon, FolderOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import api from "@/services/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const isLawyer = user?.role === "lawyer" || user?.role === "admin"
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        try {
          // Fetch dashboard summary
          const summary = await api.dashboard.getSummary()

          // Fetch recent cases
          const recentCases = await api.dashboard.getRecentCases()

          // Fetch upcoming events
          const upcomingEvents = await api.dashboard.getUpcomingEvents()

          setDashboardData({
            summary,
            recentCases: recentCases || [],
            upcomingEvents: upcomingEvents || [],
          })

          // If no cases, consider this a new user
          setIsNewUser(recentCases && recentCases.length === 0)
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          // Set as new user if we can't fetch data
          setIsNewUser(true)

          // Set empty dashboard data
          setDashboardData({
            summary: {
              activeCases: 0,
              urgentCases: 0,
              upcomingHearings: 0,
              successRate: "0%",
              documents: 0,
            },
            recentCases: [],
            upcomingEvents: [],
          })
        } finally {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in fetchDashboardData:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // If this is a new user, show welcome message
  if (isNewUser) {
    return <NewUserDashboard isLawyer={isLawyer} user={user} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Welcome, {user?.name || "User"}</div>
      </div>

      {isLawyer ? <LawyerDashboard data={dashboardData} /> : <ClientDashboard data={dashboardData} />}
    </div>
  )
}

function NewUserDashboard({ isLawyer, user }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome to Adhivakta!</h1>
        <div className="text-sm text-muted-foreground">Hello, {user?.name || "User"}</div>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome to your legal case management dashboard. Here are some steps to get started:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Create Your First Case</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first legal case to the system.</p>
              <Link href="/dashboard/cases/new" className="mt-auto">
                <Button>Add Case</Button>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Organize and store your case-related documents securely.
              </p>
              <Link href="/dashboard/documents" className="mt-auto">
                <Button>Manage Documents</Button>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Schedule Events</h3>
              <p className="text-sm text-muted-foreground mb-4">Add important dates and hearings to your calendar.</p>
              <Link href="/dashboard/calendar" className="mt-auto">
                <Button>Open Calendar</Button>
              </Link>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our user guides or contact our support team if you have any questions.
            </p>
            <div className="flex gap-3 mt-3">
              <Link href="/dashboard/help">
                <Button variant="outline">View Help Center</Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline">Configure Settings</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLawyer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Management Tips</CardTitle>
              <CardDescription>Useful advice for legal professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <ClockIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>Set up regular case review reminders to stay on top of deadlines</span>
                </li>
                <li className="flex items-start">
                  <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>Create case templates for common legal matters to save time</span>
                </li>
                <li className="flex items-start">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>Schedule client updates to maintain good communication</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="relative h-[250px] rounded-lg overflow-hidden">
            <Image
              src="/images/law-library.jpg"
              alt="Legal workspace"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white">Ready to elevate your practice?</h3>
              <p className="text-sm text-white/90 mb-4">Explore our full range of features</p>
              <Button variant="secondary">Take a Tour</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LawyerDashboard({ data }) {
  const { summary, recentCases, upcomingEvents } = data || {}

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                <h3 className="text-2xl font-bold">{summary?.activeCases || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Cases</p>
                <h3 className="text-2xl font-bold">{summary?.urgentCases || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Hearings</p>
                <h3 className="text-2xl font-bold">{summary?.upcomingHearings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Case Success Rate</p>
                <h3 className="text-2xl font-bold">{summary?.successRate || "0%"}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Your most recently updated cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases?.length > 0 ? (
                Array.from(new Map(recentCases.map(c => [c.caseNumber || c.id, c])).values()).map((caseItem, index) => (
                  <div key={caseItem.id || caseItem.caseNumber || index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{caseItem.title}</p>
                        {caseItem.urgent && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.type} • {caseItem.court}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{caseItem.date}</p>
                      <Link href={`/dashboard/cases/${caseItem.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileTextIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No cases yet</p>
                  <Link href="/dashboard/cases/new">
                    <Button variant="outline" className="mt-2">
                      Add Your First Case
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
            <CardDescription>Your schedule for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.case}</p>
                      <p className="text-xs text-muted-foreground">{event.court}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.date.split(",")[0]}</p>
                      <p className="text-sm text-muted-foreground">{event.date.split(",")[1]}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                  <Link href="/dashboard/calendar">
                    <Button variant="outline" className="mt-2">
                      Schedule an Event
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Case Management Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <ClockIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Schedule regular client updates to maintain communication</span>
              </li>
              <li className="flex items-start">
                <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Keep case documents organized by type and date</span>
              </li>
              <li className="flex items-start">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Set reminders for important deadlines and court dates</span>
              </li>
            </ul>
            <Button className="mt-2">View All Tips</Button>
          </div>
          <div className="relative hidden md:block md:col-span-2 lg:col-span-1">
            <Image
              src="/images/law-library.jpg"
              alt="Legal workspace"
              width={400}
              height={300}
              className="rounded-md object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/images/gavel.jpg"
              alt="Scales of justice"
              width={400}
              height={300}
              className="rounded-md object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function ClientDashboard({ data }) {
  const { summary, recentCases, upcomingEvents } = data || {}

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Cases</p>
                <h3 className="text-2xl font-bold">{summary?.activeCases || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Hearings</p>
                <h3 className="text-2xl font-bold">{summary?.upcomingHearings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <h3 className="text-2xl font-bold">{summary?.documents || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Cases</CardTitle>
            <CardDescription>Your active legal cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases?.length > 0 ? (
                Array.from(new Map(recentCases.map(c => [c.caseNumber || c.id, c])).values()).map((caseItem, index) => (
                  <div key={caseItem.id || caseItem.caseNumber || index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-md">
                    <div>
                      <p className="font-medium">{caseItem.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.type} • {caseItem.court}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Next Hearing</p>
                      <p className="text-sm font-medium">{caseItem.nextHearing || "N/A"}</p>
                      <Link href={`/dashboard/cases/${caseItem.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileTextIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No cases yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your lawyer will add cases for you</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled hearings and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.case}</p>
                      <p className="text-xs text-muted-foreground">{event.court}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.date.split(",")[0]}</p>
                      <p className="text-sm text-muted-foreground">{event.date.split(",")[1]}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-background p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Understanding Your Legal Process</h3>
            <p className="text-muted-foreground">
              Your lawyer is working diligently on your case. Here's what you can expect in the coming weeks:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  1
                </div>
                <span>Document review and evidence collection</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2
                </div>
                <span>Preparation of legal arguments</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  3
                </div>
                <span>Court hearing and presentation of case</span>
              </li>
            </ul>
            <Button className="mt-2">Learn More</Button>
          </div>
          <div className="relative hidden md:block">
            <Image
              src="/images/gavel.jpg"
              alt="Scales of justice"
              width={400}
              height={300}
              className="rounded-md object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </>
  )
}
