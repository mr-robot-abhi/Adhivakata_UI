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
import PartyDetails from "@/components/ui/party-details"

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

        let rawData;
        if (response && response.data) {
          console.log('API response.data:', response.data);
          rawData = response.data;
        } else if (response) { // Should ideally not hit this if API is consistent
          console.log('API response (direct):', response);
          rawData = response;
        } else {
          throw new Error("Invalid response format");
        }

        const processedData = {
          ...rawData,
          clients: Array.isArray(rawData.clients) ? rawData.clients : [],
          advocates: Array.isArray(rawData.advocates) ? rawData.advocates : [],
          parties: {
            ...(rawData.parties || {}),
            petitioner: Array.isArray(rawData.parties?.petitioner) ? rawData.parties.petitioner : [],
            respondent: Array.isArray(rawData.parties?.respondent) ? rawData.parties.respondent : []
          }
        };
        console.log('Processed caseData.parties:', processedData.parties);
        console.log('Processed caseData.advocates:', processedData.advocates);
        console.log('Processed caseData.clients:', processedData.clients);
        setCaseData(processedData);

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

  const isLawyer = user?.role === "lawyer"

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
              <TabsTrigger value="people">People</TabsTrigger>
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

            <TabsContent value="people">
              <Card>
                <CardHeader>
                  <CardTitle>People Involved</CardTitle>
                  <CardDescription>Key individuals and parties associated with the case.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lawyers Section */}
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">Legal Team</h3>
                    
                    {/* Lead Advocate - Show the lead advocate if available */}
                    {caseData.advocates?.length > 0 ? (
                      <div className="space-y-4">
                        {caseData.advocates
                          .filter(adv => adv.isLead)
                          .map((advocate, idx) => (
                            <div key={`lead-advocate-${idx}`} className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <div className="flex justify-between items-start">
                                <div className="w-full">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <User className="h-4 w-4 text-blue-600 mr-1 flex-shrink-0" />
                                    <p className="font-medium text-blue-800">
                                      {advocate.name || 'Lead Advocate'}
                                    </p>
                                    <Badge className="bg-blue-600 text-white text-xs">
                                      Lead Advocate
                                    </Badge>
                                    {advocate.level && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        {advocate.level}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="ml-5 space-y-1.5">
                                    {advocate.email && (
                                      <p className="text-sm text-gray-700 flex items-start">
                                        <span className="w-16 text-gray-500">Email:</span>
                                        <span className="flex-1">{advocate.email}</span>
                                      </p>
                                    )}
                                    {advocate.contact && (
                                      <p className="text-sm text-gray-700 flex items-start">
                                        <span className="w-16 text-gray-500">Contact:</span>
                                        <span className="flex-1">{advocate.contact}</span>
                                      </p>
                                    )}
                                    {advocate.company && (
                                      <p className="text-sm text-gray-700 flex items-start">
                                        <span className="w-16 text-gray-500">Firm:</span>
                                        <span className="flex-1">{advocate.company}</span>
                                      </p>
                                    )}
                                    {advocate.gst && (
                                      <p className="text-sm text-gray-700 flex items-start">
                                        <span className="w-16 text-gray-500">GST:</span>
                                        <span className="flex-1">{advocate.gst}</span>
                                      </p>
                                    )}
                                    {advocate.chairPosition && (
                                      <p className="text-sm text-gray-700 flex items-start">
                                        <span className="w-16 text-gray-500">Position:</span>
                                        <span className="flex-1 capitalize">
                                          {advocate.chairPosition
                                            .replace(/_/g, ' ')
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No advocate information available
                      </div>
                    )}

                    {/* Additional Advocates */}
                    {caseData.advocates?.filter(a => !a.isLead).length > 0 ? (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-3 text-gray-700">Additional Advocates</h4>
                        <div className="space-y-3">
                          {caseData.advocates
                            .filter(a => !a.isLead)
                            .map((advocate, index) => (
                              <div key={`advocate-${index}`} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                                <div className="flex justify-between items-start">
                                  <div className="w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                      <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                      <p className="font-medium text-gray-800">{advocate.name}</p>
                                      {advocate.level && (
                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                          {advocate.level}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="ml-6 space-y-1.5">
                                      {advocate.email && (
                                        <p className="text-sm text-gray-700 flex items-start">
                                          <span className="w-16 text-gray-500">Email:</span>
                                          <span className="flex-1">{advocate.email}</span>
                                        </p>
                                      )}
                                      {advocate.contact && (
                                        <p className="text-sm text-gray-700 flex items-start">
                                          <span className="w-16 text-gray-500">Contact:</span>
                                          <span className="flex-1">{advocate.contact}</span>
                                        </p>
                                      )}
                                      {advocate.company && (
                                        <p className="text-sm text-gray-700 flex items-start">
                                          <span className="w-16 text-gray-500">Firm:</span>
                                          <span className="flex-1">{advocate.company}</span>
                                        </p>
                                      )}
                                      {advocate.gst && (
                                        <p className="text-sm text-gray-700 flex items-start">
                                          <span className="w-16 text-gray-500">GST:</span>
                                          <span className="flex-1">{advocate.gst}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Additional Lawyers */}
                    {caseData.lawyers && caseData.lawyers.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {caseData.lawyers
                          .filter(lawyer => !lawyer.isPrimary)
                          .map((lawyer, index) => (
                            <div key={`lawyer-${index}`} className="p-3 border rounded-lg bg-white shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex-1">
                                    <div className="flex items-center flex-wrap gap-2">
                                      <User className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                                      <p className="font-medium text-sm">{lawyer.name}</p>
                                      
                                      {/* Role Badge */}
                                      {lawyer.role && (
                                        <Badge variant="outline" className="text-xs">
                                          {lawyer.role.charAt(0).toUpperCase() + lawyer.role.slice(1)}
                                        </Badge>
                                      )}
                                      
                                      {/* Level Badge */}
                                      {lawyer.level && (
                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                          {lawyer.level}
                                        </Badge>
                                      )}
                                      
                                      {/* Position Badge */}
                                      {lawyer.chairPosition && lawyer.chairPosition !== 'other' && (
                                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                          {lawyer.chairPosition.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Badge>
                                      )}
                                      
                                      {/* Primary Badge */}
                                      {lawyer.isPrimary && (
                                        <Badge className="ml-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                          Primary
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="ml-5 mt-2 space-y-1.5">
                                      {lawyer.email && (
                                        <p className="text-sm text-gray-600 flex items-start">
                                          <span className="w-16 text-gray-500 text-sm">Email:</span>
                                          <span className="flex-1">{lawyer.email}</span>
                                        </p>
                                      )}
                                      {lawyer.contact && (
                                        <p className="text-sm text-gray-600 flex items-start">
                                          <span className="w-16 text-gray-500 text-sm">Contact:</span>
                                          <span className="flex-1">{lawyer.contact}</span>
                                        </p>
                                      )}
                                      {lawyer.company && (
                                        <p className="text-sm text-gray-600 flex items-start">
                                          <span className="w-16 text-gray-500 text-sm">Firm:</span>
                                          <span className="flex-1">{lawyer.company}</span>
                                        </p>
                                      )}
                                      {lawyer.gst && (
                                        <p className="text-sm text-gray-600 flex items-start">
                                          <span className="w-16 text-gray-500 text-sm">GST:</span>
                                          <span className="flex-1">{lawyer.gst}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {(!caseData.lawyers || caseData.lawyers.length === 0) && (
                      <p className="text-sm text-muted-foreground">No additional lawyers have been added to this case.</p>
                    )}
                  </div>

                  {/* Clients Section */}
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">Clients</h3>
                    
                    {/* Primary Client */}
                    {caseData.client && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-green-600 mr-2" />
                              <p className="font-medium">{caseData.client.name}</p>
                              <Badge variant="default" className="ml-2 bg-green-600">Primary</Badge>
                            </div>
                            {caseData.client.email && (
                              <p className="text-sm text-gray-600 ml-6 mt-1">{caseData.client.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Clients */}
                    {caseData.clients && caseData.clients.length > 0 && (
                      <div className="space-y-3 mt-4">
                        {caseData.clients.map((client, index) => (
                          <div key={`client-${index}`} className="p-3 border rounded-lg bg-white shadow-sm">
                            <p className="font-medium text-sm flex items-center">
                              <User className="h-4 w-4 text-gray-500 mr-2" />
                              {client.name}
                            </p>
                            <div className="ml-6 mt-1 space-y-1">
                              {client.email && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <span className="w-16 text-gray-500">Email:</span>
                                  {client.email}
                                </p>
                              )}
                              {client.contact && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <span className="w-16 text-gray-500">Contact:</span>
                                  {client.contact}
                                </p>
                              )}
                              {client.address && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <span className="w-16 text-gray-500">Address:</span>
                                  <span className="flex-1">{client.address}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!caseData.clients || caseData.clients.length === 0) && (
                      <p className="text-sm text-muted-foreground">No additional clients have been added to this case.</p>
                    )}
                  </div>

                  {/* Parties Section */}
                  {(caseData.parties?.petitioner?.length > 0 || caseData.parties?.respondent?.length > 0) && (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-3 text-gray-700">Case Parties</h3>
                      
                      {/* Petitioners */}
                      {caseData.parties.petitioner?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-600">Petitioners</h4>
                          <div className="space-y-2">
                            {caseData.parties.petitioner.map((party, index) => (
                              <div key={`petitioner-${index}`} className="p-3 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <User className="h-4 w-4 text-purple-600" />
                                      <p className="font-medium text-sm">{party.name}</p>
                                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                        {party.role}
                                      </Badge>
                                    </div>
                                    <div className="ml-6 space-y-1">
                                      <p className="text-xs text-gray-600">Type: {party.type}</p>
                                      {party.email && (
                                        <p className="text-xs text-gray-600">Email: {party.email}</p>
                                      )}
                                      {party.contact && (
                                        <p className="text-xs text-gray-600">Contact: {party.contact}</p>
                                      )}
                                      {party.address && (
                                        <p className="text-xs text-gray-600">Address: {party.address}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Respondents */}
                      {caseData.parties.respondent?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-600">Respondents</h4>
                          <div className="space-y-2">
                            {caseData.parties.respondent.map((party, index) => (
                              <div key={`respondent-${index}`} className="p-3 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <User className="h-4 w-4 text-red-600" />
                                      <p className="font-medium text-sm">{party.name}</p>
                                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                        {party.role}
                                      </Badge>
                                    </div>
                                    <div className="ml-6 space-y-1">
                                      <p className="text-xs text-gray-600">Type: {party.type}</p>
                                      {party.email && (
                                        <p className="text-xs text-gray-600">Email: {party.email}</p>
                                      )}
                                      {party.contact && (
                                        <p className="text-xs text-gray-600">Contact: {party.contact}</p>
                                      )}
                                      {party.address && (
                                        <p className="text-xs text-gray-600">Address: {party.address}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stakeholders Section */}
                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">Stakeholders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Witnesses */}
                      <div className="p-4 border rounded-lg bg-amber-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-amber-600" />
                          <h4 className="font-medium">Witnesses</h4>
                        </div>
                        <p className="text-sm text-gray-600">No witnesses added yet.</p>
                      </div>

                      {/* Experts */}
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-green-600" />
                          <h4 className="font-medium">Expert Consultants</h4>
                        </div>
                        <p className="text-sm text-gray-600">No experts added yet.</p>
                      </div>

                      {/* Other Stakeholders */}
                      <div className="p-4 border rounded-lg bg-blue-50 md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium">Other Stakeholders</h4>
                        </div>
                        <p className="text-sm text-gray-600">No other stakeholders added yet.</p>
                      </div>
                    </div>
                  </div>

                  {/* Fallback if no people or parties at all */}
                  {!caseData.lawyer && !caseData.client && 
                    (!caseData.clients || caseData.clients.length === 0) && 
                    (!caseData.advocates || caseData.advocates.length === 0) && 
                    (!caseData.parties || 
                      (caseData.parties.petitioner?.length === 0 && 
                       caseData.parties.respondent?.length === 0)) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No people or party information available for this case.
                    </p>
                  )}
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
