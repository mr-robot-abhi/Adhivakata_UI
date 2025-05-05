"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import api from "@/services/api"

// Karnataka Judiciary Case Types
const CASE_TYPES = [
  { value: "civil", label: "Civil" },
  { value: "criminal", label: "Criminal" },
  { value: "family", label: "Family" },
  { value: "labour", label: "Labour" },
  { value: "revenue", label: "Revenue" },
  { value: "motor_accident", label: "Motor Accident Claims" },
  { value: "commercial", label: "Commercial" },
  { value: "writ", label: "Writ Petition" },
  { value: "appeal", label: "Appeal" },
  { value: "revision", label: "Revision" },
  { value: "execution", label: "Execution" },
  { value: "arbitration", label: "Arbitration" },
  { value: "other", label: "Other" },
]

// Karnataka Benches (used only when courtType is High Court and state is Karnataka)
const BENCHES = [
  { value: "bengaluru", label: "Bengaluru" },
  { value: "dharwad", label: "Dharwad" },
  { value: "kalaburagi", label: "Kalaburagi" },
]

// Court Types (excluding High Court)
const OTHER_COURT_TYPES = [
  { value: "district_court", label: "District Court" },
  { value: "family_court", label: "Family Court" },
  { value: "consumer_court", label: "Consumer Court" },
  { value: "labour_court", label: "Labour Court" },
  { value: "sessions_court", label: "Sessions Court" },
  { value: "civil_court", label: "Civil Court" },
  { value: "magistrate_court", label: "Magistrate Court" },
  { value: "special_court", label: "Special Court" },
]

// All States
const STATES = [
  { value: "karnataka", label: "Karnataka" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "kerala", label: "Kerala" },
  { value: "telangana", label: "Telangana" },
  { value: "goa", label: "Goa" },
]

// Districts for each state
const DISTRICTS = {
  karnataka: [
    { value: "bengaluru_urban", label: "Bengaluru Urban" },
    { value: "bengaluru_rural", label: "Bengaluru Rural" },
    { value: "mysuru", label: "Mysuru" },
    { value: "mangaluru", label: "Mangaluru" },
    { value: "belagavi", label: "Belagavi" },
    { value: "kalaburagi", label: "Kalaburagi" },
    { value: "dharwad", label: "Dharwad" },
    { value: "tumakuru", label: "Tumakuru" },
    { value: "shivamogga", label: "Shivamogga" },
    { value: "vijayapura", label: "Vijayapura" },
    { value: "davanagere", label: "Davanagere" },
    { value: "ballari", label: "Ballari" },
    { value: "udupi", label: "Udupi" },
    { value: "raichur", label: "Raichur" },
    { value: "hassan", label: "Hassan" },
  ],
  maharashtra: [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
  ],
  tamil_nadu: [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "madurai", label: "Madurai" },
  ],
  andhra_pradesh: [
    { value: "visakhapatnam", label: "Visakhapatnam" },
    { value: "vijayawada", label: "Vijayawada" },
    { value: "guntur", label: "Guntur" },
  ],
  kerala: [
    { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "kochi", label: "Kochi" },
    { value: "kottayam", label: "Kottayam" },
  ],
  telangana: [
    { value: "hyderabad", label: "Hyderabad" },
    { value: "warangal", label: "Warangal" },
    { value: "nizamabad", label: "Nizamabad" },
  ],
  goa: [
    { value: "panaji", label: "Panaji" },
    { value: "margao", label: "Margao" },
    { value: "vasco", label: "Vasco" },
  ],
}

export default function NewCasePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLawyer, setIsLawyer] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})

  useEffect(() => {
    if (user) {
      setIsLawyer(user.role === "lawyer" || user.role === "admin")
    }
  }, [user])

  const [caseData, setCaseData] = useState({
    title: "",
    caseNumber: "",
    caseType: "",
    courtState: "karnataka",
    district: "bengaluru_urban",
    bench: "",
    courtType: "",
    court: "",
    courtHall: "",
    courtComplex: "",
    filingDate: new Date(),
    hearingDate: null,
    petitionerRole: "petitioner", // New field for role selection
    petitionerType: "individual",
    petitionerNames: [], // Changed from petitioner to array for names
    opposingRole: "defendant", // New field for role selection
    opposingPartyNames: [], // Changed from opposingParty to array for names
    opposingCounsel: "",
    description: "",
    status: "active",
    priority: "normal",
    isUrgent: false,
    caseStage: "filing",
    actSections: "",
    reliefSought: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setCaseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    if (name === "courtState") {
      setCaseData((prev) => ({
        ...prev,
        courtState: value,
        district: DISTRICTS[value][0].value,
        bench: "",
      }))
    } else if (name === "courtType") {
      setCaseData((prev) => ({
        ...prev,
        [name]: value,
        bench: value === "high_court" && prev.courtState === "karnataka" ? "bengaluru" : "",
      }))
    } else if (name === "petitionerRole" || name === "opposingRole" || name === "petitionerType") {
      setCaseData((prev) => ({ ...prev, [name]: value }))
    } else {
      setCaseData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDateChange = (name, date) => {
    setCaseData((prev) => ({ ...prev, [name]: date }))
  }

  const handleCheckboxChange = (name, checked) => {
    setCaseData((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePartyAdd = (side) => {
    const nameInput = document.getElementById(`new${side}Name`).value
    if (nameInput && caseData[`${side}Names`].length < 3) {
      setCaseData((prev) => ({
        ...prev,
        [`${side}Names`]: [...prev[`${side}Names`], nameInput],
      }))
      document.getElementById(`new${side}Name`).value = "" // Clear the input
    }
  }

  const handlePartyRemove = (side, index) => {
    setCaseData((prev) => {
      const newNames = prev[`${side}Names`].filter((_, i) => i !== index)
      return { ...prev, [`${side}Names`]: newNames }
    })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const uploadDocuments = async (caseId) => {
    if (selectedFiles.length === 0) return []

    const uploadedDocs = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("caseId", caseId)
        formData.append("name", file.name)
        formData.append("description", `Document for case ${caseData.title}`)

        // Upload the document
        const response = await api.documents.upload(formData, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress((prev) => ({ ...prev, [file.name]: percentCompleted }))
        })

        uploadedDocs.push(response.data)
      } catch (error) {
        console.error(`Error uploading document ${file.name}:`, error)
      }
    }

    return uploadedDocs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!caseData.title || !caseData.caseNumber || !caseData.caseType || !caseData.status) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields: Case Title, Case Number, Case Type, and Status.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Format data for API
      const apiCaseData = {
        ...caseData,
        hearingDate: caseData.hearingDate ? caseData.hearingDate.toISOString() : null,
        filingDate: caseData.filingDate ? caseData.filingDate.toISOString() : new Date().toISOString(),
      }

      // API call to create a new case
      const newCase = await api.cases.create(apiCaseData)
      console.log("Case created:", newCase)

      // Upload documents if any are selected
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("caseId", newCase.id || newCase._id)
            formData.append("name", file.name)
            formData.append("description", `Document for case ${caseData.title}`)

            await api.documents.upload(formData, (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress((prev) => ({ ...prev, [file.name]: percentCompleted }))
            })
          } catch (uploadError) {
            console.error(`Error uploading document ${file.name}:`, uploadError)
          }
        }
      }

      // If the case has a hearing date, create a calendar event
      if (caseData.hearingDate) {
        try {
          const eventData = {
            title: `Hearing - ${caseData.title}`,
            case: newCase.id || newCase._id,
            start: caseData.hearingDate.toISOString(),
            end: new Date(caseData.hearingDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
            type: "hearing",
            location: `${caseData.court}, Court Hall ${caseData.courtHall}`,
            description: `Hearing for case ${caseData.caseNumber || caseData.title}`,
          }

          await api.events.create(eventData)
        } catch (eventError) {
          console.error("Error creating hearing event:", eventError)
        }
      }

      toast({
        title: "Case created successfully",
        description: "Your new case has been created and saved.",
      })

      router.push("/dashboard/cases")
    } catch (error) {
      console.error("Error saving case:", error)

      toast({
        title: "Error creating case",
        description: "There was an error saving the case. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const districtOptions = DISTRICTS[caseData.courtState] || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Case</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="court">Court Information</TabsTrigger>
              <TabsTrigger value="party">Party Section</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                  <CardDescription>Enter the basic details about the case</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="case-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Case Title <span className="text-red-500">*</span>
                        </Label>
                        <Input id="title" name="title" value={caseData.title} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="caseNumber">
                          Case Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="caseNumber"
                          name="caseNumber"
                          value={caseData.caseNumber}
                          onChange={handleChange}
                          placeholder="e.g., CRL/123/2023"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="caseType">
                          Case Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={caseData.caseType}
                          onValueChange={(value) => handleSelectChange("caseType", value)}
                          required
                        >
                          <SelectTrigger id="caseType">
                            <SelectValue placeholder="Select case type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CASE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">
                          Status <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={caseData.status}
                          onValueChange={(value) => handleSelectChange("status", value)}
                          required
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="filingDate">Filing Date</Label>
                        <DatePicker
                          id="filingDate"
                          selected={caseData.filingDate}
                          onSelect={(date) => handleDateChange("filingDate", date)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hearingDate">Next Hearing Date</Label>
                        <DatePicker
                          id="hearingDate"
                          selected={caseData.hearingDate}
                          onSelect={(date) => handleDateChange("hearingDate", date)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={caseData.priority}
                          onValueChange={(value) => handleSelectChange("priority", value)}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="caseStage">Case Stage</Label>
                        <Select
                          value={caseData.caseStage}
                          onValueChange={(value) => handleSelectChange("caseStage", value)}
                        >
                          <SelectTrigger id="caseStage">
                            <SelectValue placeholder="Select case stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="filing">Filing</SelectItem>
                            <SelectItem value="pre_trial">Pre-Trial</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="arguments">Arguments</SelectItem>
                            <SelectItem value="judgment">Judgment</SelectItem>
                            <SelectItem value="appeal">Appeal</SelectItem>
                            <SelectItem value="execution">Execution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isUrgent"
                        checked={caseData.isUrgent}
                        onCheckedChange={(checked) => handleCheckboxChange("isUrgent", checked)}
                      />
                      <Label htmlFor="isUrgent">Mark as urgent case</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Case Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={caseData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    {isLawyer && (
                      <div className="space-y-2">
                        <Label htmlFor="actSections">Act & Sections</Label>
                        <Textarea
                          id="actSections"
                          name="actSections"
                          value={caseData.actSections}
                          onChange={handleChange}
                          rows={2}
                          placeholder="e.g., IPC Section 302, CrPC Section 161"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="reliefSought">Relief Sought</Label>
                      <Textarea
                        id="reliefSought"
                        name="reliefSought"
                        value={caseData.reliefSought}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Describe the relief sought in this case"
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="court">
              <Card>
                <CardHeader>
                  <CardTitle>Court Information</CardTitle>
                  <CardDescription>Enter details about the court where the case is filed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {isLawyer && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="courtState">State</Label>
                            <Select
                              value={caseData.courtState}
                              onValueChange={(value) => handleSelectChange("courtState", value)}
                            >
                              <SelectTrigger id="courtState">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATES.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Select
                              value={caseData.district}
                              onValueChange={(value) => handleSelectChange("district", value)}
                            >
                              <SelectTrigger id="district">
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                              <SelectContent>
                                {districtOptions.map((district) => (
                                  <SelectItem key={district.value} value={district.value}>
                                    {district.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="courtType">Court Type</Label>
                            <Select
                              value={caseData.courtType}
                              onValueChange={(value) => handleSelectChange("courtType", value)}
                            >
                              <SelectTrigger id="courtType">
                                <SelectValue placeholder="Select court type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high_court">High Court</SelectItem>
                                {OTHER_COURT_TYPES.map((court) => (
                                  <SelectItem key={court.value} value={court.value}>
                                    {court.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {caseData.courtType === "high_court" && caseData.courtState === "karnataka" && (
                            <div className="space-y-2">
                              <Label htmlFor="bench">Bench</Label>
                              <Select
                                value={caseData.bench}
                                onValueChange={(value) => handleSelectChange("bench", value)}
                              >
                                <SelectTrigger id="bench">
                                  <SelectValue placeholder="Select bench" />
                                </SelectTrigger>
                                <SelectContent>
                                  {BENCHES.map((bench) => (
                                    <SelectItem key={bench.value} value={bench.value}>
                                      {bench.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="court">Court Name</Label>
                            <Input id="court" name="court" value={caseData.court} onChange={handleChange} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="courtHall">Court Hall Number</Label>
                            <Input id="courtHall" name="courtHall" value={caseData.courtHall} onChange={handleChange} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="courtComplex">Court Complex</Label>
                          <Input
                            id="courtComplex"
                            name="courtComplex"
                            value={caseData.courtComplex}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={caseData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any additional notes about the court or proceedings"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="party">
              <Card>
                <CardHeader>
                  <CardTitle>Party Section</CardTitle>
                  <CardDescription>Enter details for both legal sides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Petitioner/Appellant/Plaintiff/Complainant Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Petitioner/Appellant/Plaintiff/Complainant Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="petitionerRole">Role</Label>
                          <Select
                            value={caseData.petitionerRole}
                            onValueChange={(value) => handleSelectChange("petitionerRole", value)}
                          >
                            <SelectTrigger id="petitionerRole">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petitioner">Petitioner</SelectItem>
                              <SelectItem value="appellant">Appellant</SelectItem>
                              <SelectItem value="plaintiff">Plaintiff</SelectItem>
                              <SelectItem value="complainant">Complainant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="petitionerType">Party Type</Label>
                          <Select
                            value={caseData.petitionerType}
                            onValueChange={(value) => handleSelectChange("petitionerType", value)}
                          >
                            <SelectTrigger id="petitionerType">
                              <SelectValue placeholder="Select party type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex space-x-2">
                          <Input id="newPetitionerName" placeholder="Enter party name" />
                          <Button onClick={() => handlePartyAdd("petitioner")}>Add Party</Button>
                        </div>

                        {caseData.petitionerNames.map((name, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span>{name}</span>
                            <Button variant="ghost" size="sm" onClick={() => handlePartyRemove("petitioner", index)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Defendant/Respondent/Accused/Opponent Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Defendant/Respondent/Accused/Opponent Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="opposingRole">Role</Label>
                          <Select
                            value={caseData.opposingRole}
                            onValueChange={(value) => handleSelectChange("opposingRole", value)}
                          >
                            <SelectTrigger id="opposingRole">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="defendant">Defendant</SelectItem>
                              <SelectItem value="respondent">Respondent</SelectItem>
                              <SelectItem value="accused">Accused</SelectItem>
                              <SelectItem value="opponent">Opponent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="opposingCounsel">Opposing Counsel</Label>
                          <Input
                            id="opposingCounsel"
                            name="opposingCounsel"
                            value={caseData.opposingCounsel}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Input id="newOpposingPartyName" placeholder="Enter party name" />
                          <Button onClick={() => handlePartyAdd("opposingParty")}>Add Party</Button>
                        </div>

                        {caseData.opposingPartyNames.map((name, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span>{name}</span>
                            <Button variant="ghost" size="sm" onClick={() => handlePartyRemove("opposingParty", index)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Case Documents</CardTitle>
                  <CardDescription>Upload and manage documents related to this case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here, or click to select files
                        </p>
                        <div className="mt-4">
                          <input
                            type="file"
                            id="document-upload"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                          />
                          <Button variant="outline" onClick={() => document.getElementById("document-upload").click()}>
                            Select Files
                          </Button>
                        </div>
                      </div>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Selected Files</h3>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024).toFixed(2)} KB)
                                </span>
                              </div>
                              {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${uploadProgress[file.name]}%` }}
                                  ></div>
                                </div>
                              )}
                              {uploadProgress[file.name] === 100 && (
                                <span className="text-xs text-green-600">Uploaded</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>)}
                      
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Required Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc1" />
                          <Label htmlFor="doc1" className="text-sm">
                            Petition/Complaint
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc2" />
                          <Label htmlFor="doc2" className="text-sm">
                            Affidavit
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc3" />
                          <Label htmlFor="doc3" className="text-sm">
                            Power of Attorney
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc4" />
                          <Label htmlFor="doc4" className="text-sm">
                            Evidence Documents
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc5" />
                          <Label htmlFor="doc5" className="text-sm">
                            Court Fee Receipt
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Case Filing Guide</CardTitle>
              <CardDescription>Tips for filing a new case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full">
                <Image
                  src="/images/law-library.jpg"
                  alt="Legal documents"
                  fill
                  className="object-cover rounded-md hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Required Information</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Complete case title</li>
                  <li>Court details including hall number</li>
                  <li>Client (Petitioner) information</li>
                  <li>Filing date</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Document Checklist</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Petition/Complaint</li>
                  <li>Supporting affidavits</li>
                  <li>Evidence documents</li>
                  <li>Court fee receipts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
