"use client";

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, FileText, MapPin, User, Users, AlertTriangle, CheckCircle } from "lucide-react"
import api from "@/services/api"

export default function CaseDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [documents, setDocuments] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true)
      try {
        console.log("Fetching case details for ID:", id)
        // Fetch case details
        const response = await api.cases.getById(id)
        console.log("Case details response:", response)

        // Handle different response formats
        if (response && response.data) {
          setCaseData(response.data)
        } else if (response) {
          setCaseData(response)
        } else {
          throw new Error("Invalid response format")
        }

        // Fetch related documents if available
        try {
          const docsResponse = await api.documents.getByCaseId(id)
          console.log("Documents response:", docsResponse)
          if (docsResponse && Array.isArray(docsResponse.data)) {
            setDocuments(docsResponse.data)
          } else if (docsResponse && Array.isArray(docsResponse)) {
            setDocuments(docsResponse)
          }
        } catch (docError) {
          console.error("Error fetching documents:", docError)
          // Non-critical error, continue with case display
        }

        // Fetch related events if available
        try {
          const eventsResponse = await api.events.getByCaseId(id)
          console.log("Events response:", eventsResponse)
          if (eventsResponse && Array.isArray(eventsResponse.data)) {
            setEvents(eventsResponse.data)
          } else if (eventsResponse && Array.isArray(eventsResponse)) {
            setEvents(eventsResponse)
          }
        } catch (eventError) {
          console.error("Error fetching events:", eventError)
          // Non-critical error, continue with case display
        }
      } catch (error) {
        console.error("Error fetching case details:", error)
        setError("Failed to load case details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCaseDetails()
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    const statusMap = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
      archived: "bg-blue-100 text-blue-800",
    }
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority) => {
    const priorityMap = {
      low: "bg-blue-100 text-blue-800",
      normal: "bg-green-100 text-green-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return priorityMap[priority?.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || "Case not found"}</p>
        <Button onClick={() => router.push("/dashboard/cases")}>Back to Cases</Button>
      </div>
    )
  }

  const isLawyer = user?.role === "lawyer" || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/cases")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{caseData.title}</h1>
        </div>
        {isLawyer && <Button onClick={() => router.push(`/dashboard/cases/${id}/edit`)}>Edit Case</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="hearings">Hearings</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                  <CardDescription>Details and status of the case</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Case Number</h3>
                      <p className="text-base">{caseData.caseNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Case Type</h3>
                      <p className="text-base capitalize">{caseData.caseType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge className={getStatusColor(caseData.status)}>
                        {caseData.status?.charAt(0).toUpperCase() + caseData.status?.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                      <Badge className={getPriorityColor(caseData.priority)}>
                        {caseData.priority?.charAt(0).toUpperCase() + caseData.priority?.slice(1) || "Normal"}
                      </Badge>
                      {caseData.isUrgent && (
                        <Badge className="ml-2 bg-red-100 text-red-800">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Filing Date</h3>
                      <p className="text-base flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(caseData.filingDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Next Hearing</h3>
                      <p className="text-base flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(caseData.hearingDate || caseData.nextHearingDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Case Stage</h3>
                      <p className="text-base capitalize">
                        {caseData.caseStage?.replace(/_/g, " ") || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Court Information</h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-base flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {caseData.court || "Not specified"}
                        {caseData.courtHall && `, Hall ${caseData.courtHall}`}
                      </p>
                      {caseData.district && (
                        <p className="text-sm text-muted-foreground pl-6">
                          District: {caseData.district?.replace(/_/g, " ")}
                        </p>
                      )}
                      {caseData.courtComplex && (
                        <p className="text-sm text-muted-foreground pl-6">Complex: {caseData.courtComplex}</p>
                      )}
                    </div>
                  </div>

                  {caseData.description && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p className="mt-2 text-base">{caseData.description}</p>
                      </div>
                    </>
                  )}

                  {caseData.actSections && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Act & Sections</h3>
                        <p className="mt-2 text-base">{caseData.actSections}</p>
                      </div>
                    </>
                  )}

                  {caseData.reliefSought && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Relief Sought</h3>
                        <p className="mt-2 text-base">{caseData.reliefSought}</p>
                      </div>
                    </>
                  )}

                  {caseData.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
                        <p className="mt-2 text-base">{caseData.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parties">
              <Card>
                <CardHeader>
                  <CardTitle>Parties</CardTitle>
                  <CardDescription>Case parties and their representatives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Petitioners/Plaintiffs/Appellants/Complainants Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Petitioners/Plaintiffs/Appellants/Complainants</h3>
                    </div>
                    {caseData.parties?.petitioner?.length > 0 ? (
                      <div className="space-y-4">
                        {caseData.parties.petitioner.map((party, idx) => (
                          <div key={`petitioner-${idx}`} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{party.name}</p>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <span className="capitalize">{party.role}</span>
                                  {party.type && <span className="ml-2">• {party.type}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg">
                        <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No petitioners/plaintiffs/appellants/complainants added</p>
                      </div>
                    )}
                  </div>

                  {/* Respondents/Defendants/Accused/Opponents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Respondents/Defendants/Accused/Opponents</h3>
                    </div>
                    {caseData.parties?.respondent?.length > 0 ? (
                      <div className="space-y-4">
                        {caseData.parties.respondent.map((party, idx) => (
                          <div key={`respondent-${idx}`} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{party.name}</p>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <span className="capitalize">{party.role}</span>
                                  {party.type && <span className="ml-2">• {party.type}</span>}
                                  {party.opposingCounsel && (
                                    <div className="mt-2 text-sm bg-muted/50 p-2 rounded">
                                      <p className="font-medium">Opposing Counsel:</p>
                                      <p>{party.opposingCounsel}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg">
                        <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No respondents/defendants/accused/opponents added</p>
                      </div>
                    )}
                  </div>

                  {/* Advocates Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Advocates</h3>
                    {caseData.advocates?.length > 0 ? (
                      <div className="space-y-4">
                        {caseData.advocates.map((advocate, idx) => (
                          <div key={`advocate-${idx}`} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium">{advocate.name}</p>
                                  {advocate.isLead && (
                                    <Badge variant="secondary" className="ml-2">
                                      Lead
                                    </Badge>
                                  )}
                                </div>
                                {advocate.email && <p className="text-sm text-muted-foreground">{advocate.email}</p>}
                                {advocate.contact && <p className="text-sm text-muted-foreground">{advocate.contact}</p>}
                                {advocate.company && <p className="text-sm text-muted-foreground">{advocate.company}</p>}
                              </div>
                              {advocate.level && (
                                <Badge variant={advocate.level === "Senior" ? "default" : "outline"}>
                                  {advocate.level}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg">
                        <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No advocates have been added to this case</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Case Documents</CardTitle>
                  <CardDescription>Documents related to this case</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents && documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.description || "No description"}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.fileUrl || doc.signedUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                      <p className="text-sm text-muted-foreground">There are no documents attached to this case yet.</p>
                    </div>
                  )}
                </CardContent>
                {isLawyer && (
                  <CardFooter>
                    <Button className="w-full" onClick={() => router.push(`/dashboard/documents/upload?caseId=${id}`)}>
                      Upload New Document
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="hearings">
              <Card>
                <CardHeader>
                  <CardTitle>Hearings</CardTitle>
                  <CardDescription>Next hearing and hearing history for this case</CardDescription>
                </CardHeader>
                <CardContent>
                  {caseData.nextHearingDate || caseData.hearingDate ? (
                    <div className="space-y-4">
                      <div className="flex items-start p-3 border rounded-md">
                        <div className="mr-3 mt-1">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Next Hearing</p>
                            <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(caseData.nextHearingDate || caseData.hearingDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No hearings scheduled</h3>
                      <p className="text-sm text-muted-foreground">
                        There is no next hearing set for this case yet.
                      </p>
                    </div>
                  )}
                </CardContent>
                {isLawyer && (
                  <CardFooter>
                    <Button className="w-full" onClick={() => router.push(`/dashboard/cases/${id}/edit`)}>
                      Set Next Hearing
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Case Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge className={getStatusColor(caseData.status)}>
                    {caseData.status?.charAt(0).toUpperCase() + caseData.status?.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Case Type</h3>
                  <span className="text-sm capitalize">{caseData.caseType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Filing Date</h3>
                  <span className="text-sm">{formatDate(caseData.filingDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Next Hearing</h3>
                  <span className="text-sm">{formatDate(caseData.hearingDate || caseData.nextHearingDate)}</span>
                </div>
                {caseData.court && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Court</h3>
                    <span className="text-sm">{caseData.court}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Key Parties</h3>
                {caseData.petitionerNames && caseData.petitionerNames.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {caseData.petitionerRole?.charAt(0).toUpperCase() + caseData.petitionerRole?.slice(1) ||
                        "Petitioner"}
                    </p>
                    <p className="text-sm">{caseData.petitionerNames[0]}</p>
                  </div>
                )}
                {caseData.opposingPartyNames && caseData.opposingPartyNames.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      {caseData.opposingRole?.charAt(0).toUpperCase() + caseData.opposingRole?.slice(1) || "Defendant"}
                    </p>
                    <p className="text-sm">{caseData.opposingPartyNames[0]}</p>
                  </div>
                )}
              </div>

              {documents && documents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium">Documents</h3>
                    <p className="text-sm">{documents.length} document(s) attached</p>
                  </div>
                </>
              )}

              {events && events.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium">Hearings</h3>
                    <p className="text-sm">{events.length} hearing(s) scheduled</p>
                  </div>
                </>
              )}
            </CardContent>
            {isLawyer && (
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" variant="outline" onClick={() => router.push(`/dashboard/cases/${id}/edit`)}>
                  Edit Case
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/documents/upload?caseId=${id}`)}
                >
                  Upload Document
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/calendar/new?caseId=${id}`)}
                >
                  Schedule Hearing
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
