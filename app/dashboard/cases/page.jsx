"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/services/api"

export default function CasesPage() {
  const { user } = useAuth()
  const [isLawyer, setIsLawyer] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [caseFilter, setCaseFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [dateFilter, setDateFilter] = useState("all")
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is lawyer or client
    if (user) {
      setIsLawyer(user.role === "lawyer" || user.role === "admin")
    }
  }, [user])

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true)
      try {
        // Prepare filter parameters
        const filters = {
          search: searchTerm,
          status: statusFilter !== "All Statuses" ? statusFilter.toLowerCase() : undefined,
          type: categoryFilter !== "All Categories" ? categoryFilter : undefined,
          date: dateFilter !== "all" ? dateFilter : undefined,
        }

        // API call to fetch cases
        const response = await api.cases.getAll(filters)

        // Ensure response is an array
        const casesArray = Array.isArray(response) ? response : response.data || []

        // Validate that casesArray contains valid case objects
        if (!casesArray.every(item => item && typeof item === 'object' && 'id' in item)) {
          throw new Error("Invalid case data received from API")
        }

        setCases(casesArray)
      } catch (error) {
        console.error("Error fetching cases:", error)
        setError("Failed to load cases. Please try again.")

        // Fallback to sample data
        setCases(isLawyer ? lawyerCases : clientCases)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [isLawyer, searchTerm, caseFilter, categoryFilter, statusFilter, dateFilter])

  // Filter cases based on search and filters
  const filteredCases = cases.filter((caseItem) => {
    // Ensure caseItem has required properties
    if (!caseItem || !caseItem.title || !caseItem.number || !caseItem.court) {
      return false
    }

    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.court.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "All Statuses" || caseItem.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType =
      categoryFilter === "All Categories" || caseItem.type.toLowerCase() === categoryFilter.toLowerCase()
    const matchesDistrict = caseFilter === "all" || caseItem.district.toLowerCase() === caseFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType && matchesDistrict
  })

  // Get unique values for filters
  const caseTypes = ["All Categories", ...new Set(cases.map((c) => c.type).filter(Boolean))]
  const districts = ["all", ...new Set(cases.map((c) => c.district).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cases</h1>
        {isLawyer && (
          <Link href="/dashboard/cases/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>{isLawyer ? "All Cases" : "My Cases"}</CardTitle>
              <CardDescription>
                {isLawyer ? "Manage and view all your legal cases" : "View your active legal cases"}
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cases..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Case Type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All Categories" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={caseFilter} onValueChange={setCaseFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district === "all" ? "All Districts" : district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Case Title</th>
                  <th className="py-3 text-left font-medium">Case Number</th>
                  <th className="py-3 text-left font-medium">Type</th>
                  {isLawyer && <th className="py-3 text-left font-medium">Client</th>}
                  <th className="py-3 text-left font-medium">Court</th>
                  <th className="py-3 text-left font-medium">Court Hall</th>
                  <th className="py-3 text-left font-medium">District</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Next Hearing</th>
                  <th className="py-3 text-left font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <Link
                        href={`/dashboard/cases/${caseItem.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {caseItem.title}
                      </Link>
                    </td>
                    <td className="py-3">{caseItem.number}</td>
                    <td className="py-3">{caseItem.type}</td>
                    {isLawyer && <td className="py-3">{caseItem.client}</td>}
                    <td className="py-3">{caseItem.court}</td>
                    <td className="py-3">{caseItem.courtHall}</td>
                    <td className="py-3">{caseItem.district}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          caseItem.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Sample case data for fallback
const lawyerCases = [
  {
    id: "case-1",
    title: "Smith v. Johnson",
    number: "CV-2023-1234",
    type: "Civil Litigation",
    client: "John Smith",
    status: "Active",
    court: "Bangalore Urban District Court",
    courtHall: "4",
    courtComplex: "City Civil Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-15",
  },
  {
    id: "case-2",
    title: "Estate of Williams",
    number: "PR-2023-5678",
    type: "Probate",
    client: "Sarah Williams",
    status: "Active",
    court: "Karnataka High Court",
    courtHall: "7",
    courtComplex: "High Court Complex",
    district: "Bangalore Urban",
    nextHearing: null,
  },
  {
    id: "case-3",
    title: "Brown LLC v. Davis Corp",
    number: "CV-2023-9012",
    type: "Corporate",
    client: "Brown LLC",
    status: "Active",
    court: "Commercial Court",
    courtHall: "2",
    courtComplex: "Commercial Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-20",
  },
  {
    id: "case-4",
    title: "Miller Divorce",
    number: "DR-2023-3456",
    type: "Family",
    client: "James Miller",
    status: "Active",
    court: "Family Court",
    courtHall: "3",
    courtComplex: "Family Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-18",
  },
  {
    id: "case-5",
    title: "Thompson Bankruptcy",
    number: "BK-2023-7890",
    type: "Bankruptcy",
    client: "Robert Thompson",
    status: "Closed",
    court: "Debt Recovery Tribunal",
    courtHall: "1",
    courtComplex: "DRT Complex",
    district: "Bangalore Rural",
    nextHearing: null,
  },
]

const clientCases = [
  {
    id: "case-1",
    title: "Property Dispute",
    number: "CV-2023-4567",
    type: "Civil",
    status: "Active",
    court: "Bangalore Urban District Court",
    courtHall: "4",
    courtComplex: "City Civil Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-06-15",
  },
  {
    id: "case-2",
    title: "Insurance Claim",
    number: "CC-2023-7890",
    type: "Consumer",
    status: "Active",
    court: "Consumer Court",
    courtHall: "2",
    courtComplex: "Consumer Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-06-22",
  },
  {
    id: "case-3",
    title: "Employment Matter",
    number: "LC-2023-1234",
    type: "Labor",
    status: "Active",
    court: "Labor Court",
    courtHall: "5",
    courtComplex: "Labor Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-07-05",
  },
]