"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, FileTextIcon, BarChart3Icon, ClockIcon, AlertCircleIcon, FolderOpen, Users, Eye } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import api from "@/services/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const isLawyer = user?.role === "lawyer"
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  // Keep a reference to fetchDashboardData for manual refresh
  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard summary
      const summary = await api.dashboard.getSummary()
      console.log('DASHBOARD SUMMARY:', summary);

      // Fetch recent cases
      const recentCases = await api.dashboard.getRecentCases()

      // Fetch upcoming events
      const upcomingEvents = await api.dashboard.getUpcomingEvents()

      console.log('Fetched summary:', summary);
      console.log('Fetched recentCases:', recentCases);
      console.log('Fetched upcomingEvents:', upcomingEvents);
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
      setDashboardData({
        summary: {
          activeCases: 0,
          urgentCases: 0,
          upcomingHearings: 0,
          successRate: "0%",
          documents: 0,
          totalCases: 0,
        },
        recentCases: [],
        upcomingEvents: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
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

import DashboardStats from "@/components/dashboard/DashboardStats";
import CaseStatisticsChart from "@/components/dashboard/CaseStatisticsChart";

function LawyerDashboard({ data }) {
  const { summary, recentCases, upcomingEvents } = data || {}
  const totalCases = summary?.totalCases || 0;
  const pendingTasks = summary?.urgentCases || 0;
  const activeCases = summary?.activeCases || 0;
  return (
    <>
      <DashboardStats
        totalCases={totalCases}
        pendingTasks={pendingTasks}
        activeThirdParty={activeCases}
        activeLabel="Active Cases"
        totalCasesDesc="Total cases managed"
        pendingTasksDesc="Requires immediate attention"
        activeThirdPartyDesc="Currently active cases"
        className="text-base [&_.text-3xl]:text-2xl"
      />
      <Card className="mt-8 shadow-md">
        <CardContent>
          <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            {upcomingEvents?.length > 0 ? (
              upcomingEvents
                .sort((a, b) => new Date(a.start || a.date) - new Date(b.start || b.date))
                .map((event, index) => (
                  <div key={event.id || index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 capitalize`}>{event.type?.replace('_', ' ')}</span>
                        <p className="font-medium inline">{event.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.caseId || event.case_id ? (
  <Link href={`/dashboard/cases/${event.caseId || event.case_id}`}
    className="text-sm text-blue-600 hover:underline">
    {event.case || event.caseTitle || ''}
  </Link>
) : (
  <span className="text-sm text-muted-foreground">{event.case || event.caseTitle || ''}</span>
)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.start ? new Date(event.start).toLocaleDateString() : event.date || ''}</p>
                      <p className="text-xs text-muted-foreground">{event.start ? new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">No events found.</div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
          <CardDescription>Your most recently updated cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Case Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Advocate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Next Hearing</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentCases?.length > 0 ? (
                  recentCases.map((caseItem, idx) => (
                    <tr key={caseItem.id || caseItem.caseNumber || idx} className="hover:bg-gray-100 transition">
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{caseItem.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                        {caseItem.lawyer?.name || caseItem.advocateName || '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {caseItem.status && (
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                            caseItem.status.toLowerCase() === 'open' || caseItem.status === 'active' 
                              ? 'bg-gray-200 text-black' 
                              : caseItem.status.toLowerCase() === 'closed' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-gray-400 text-white'
                          }`}>
                            {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1).toLowerCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                        {caseItem.nextHearingDate || caseItem.nextHearing || 'N/A'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/dashboard/cases/${caseItem.id}`}> 
                          <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">No recent cases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/dashboard/cases">
              <Button variant="outline">
                View All Cases
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
  const { summary, recentCases, upcomingEvents } = data || {};
  const totalCases = summary?.totalCases || 0;
  const pendingTasks = summary?.urgentCases || 0;
  const activeCases = summary?.activeCases || 0;
  return (
    <>
      <DashboardStats
        totalCases={totalCases}
        pendingTasks={pendingTasks}
        activeThirdParty={activeCases}
        activeLabel="Active Cases"
        totalCasesDesc="Total cases managed"
        pendingTasksDesc="Requires immediate attention"
        activeThirdPartyDesc="Currently active cases"
        className="text-base [&_.text-3xl]:text-2xl"
      />
      <Card className="mt-8 shadow-md">
        <CardContent>
          <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            {upcomingEvents?.length > 0 ? (
              upcomingEvents
                .sort((a, b) => new Date(a.start || a.date) - new Date(b.start || b.date))
                .map((event, index) => (
                  <div key={event.id || index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 capitalize`}>{event.type?.replace('_', ' ')}</span>
                        <p className="font-medium inline">{event.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.caseId || event.case_id ? (
  <Link href={`/dashboard/cases/${event.caseId || event.case_id}`}
    className="text-sm text-blue-600 hover:underline">
    {event.case || event.caseTitle || ''}
  </Link>
) : (
  <span className="text-sm text-muted-foreground">{event.case || event.caseTitle || ''}</span>
)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <p className="text-sm font-medium">{event.start ? new Date(event.start).toLocaleDateString() : event.date || ''}</p>
                        <p className="text-xs text-muted-foreground">{event.start ? new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                      </div>
                      { (event.caseId || event.case_id) && (
                        <Link href={`/dashboard/cases/${event.caseId || event.case_id}`} className="ml-2 text-blue-600 hover:text-blue-800" title="View Case Details">
                          <Eye className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">No events found.</div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
          <CardDescription>Latest case entries and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-md">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Case Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Advocate</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Next Hearing</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCases?.length > 0 ? (
                  recentCases.map((caseItem, idx) => (
                    <tr key={caseItem.id || idx} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">{caseItem.title}</td>
                      <td className="px-4 py-2">
                        {caseItem.lawyer?.name || caseItem.advocateName || '-'}
                      </td>
                      <td className="px-4 py-2">
                        {caseItem.status && (
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                            caseItem.status.toLowerCase() === 'open' || caseItem.status === 'active' 
                              ? 'bg-gray-200 text-black' 
                              : caseItem.status.toLowerCase() === 'closed' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-gray-400 text-white'
                          }`}>
                            {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1).toLowerCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {caseItem.nextHearingDate || caseItem.nextHearing || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        <Link href={`/dashboard/cases/${caseItem.id}`}> 
                          <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">No recent cases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/dashboard/cases">
              <Button variant="outline">
                View All Cases
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="relative overflow-hidden rounded-lg border bg-background p-6 mt-8">
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
  );
}