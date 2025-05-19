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
    courtType: "district_court",
    court: "",
    courtHall: "",
    courtComplex: "",
    filingDate: new Date(),
    hearingDate: null,
    petitionerRole: "petitioner",
    petitionerType: "individual",
    petitionerNames: [],
    opposingRole: "defendant",
    opposingPartyNames: [],
    opposingCounsel: "",
    description: "",
    status: "active",
    priority: "normal",
    isUrgent: false,
    caseStage: "filing",
    actSections: "",
    reliefSought: "",
    notes: "",
    advocates: [], // Only allowed advocate fields will be added
    parties: undefined // will be set on submit
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

    try {
      // Create a single FormData object for all files
      const formData = new FormData()
      
      // Append all files with the same field name 'files'
      selectedFiles.forEach(file => {
        formData.append("files", file)
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      })
      
      // Add metadata
      formData.append("name", "Files for " + caseData.title)
      formData.append("description", `Documents for case ${caseData.title}`)
      formData.append("category", caseData.caseType)

      // Upload all documents in a single request
      const response = await api.documents.uploadToCaseId(caseId, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        // Update progress for all files
        const newProgress = {}
        selectedFiles.forEach(file => {
          newProgress[file.name] = percentCompleted
        })
        setUploadProgress(prev => ({ ...prev, ...newProgress }))
      })

      if (response && response.data) {
        uploadedDocs.push(...(Array.isArray(response.data) ? response.data : [response.data]))
      }
    } catch (error) {
      console.error(`Error uploading documents:`, error)
    }

    return uploadedDocs
  }

  // Update the handleSubmit function to allow clients to create cases
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
    toast({
      title: "Missing required fields",
      description: "Please fill in all required fields: Case Title, Case Number, Case Type, and Status.",
      variant: "destructive",
    })
    setIsSubmitting(false)
    return
  }

  // Validate advocates if present
  if (caseData.advocates && caseData.advocates.length > 0) {
    for (const [idx, advocate] of caseData.advocates.entries()) {
      if (!advocate.name) {
        toast({
          title: `Missing advocate name`,
          description: `Please fill the name for advocate #${idx + 1}.`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    }
  }

  try {
      // Format data for API
      const parties = {
        petitioner: (caseData.petitionerNames || []).map(name => ({
          role: caseData.petitionerRole || "Petitioner",
          type: caseData.petitionerType || "Individual",
          name: name
        })),
        respondent: (caseData.opposingPartyNames || []).map(name => ({
          role: caseData.opposingRole || "Defendant",
          type: "Individual",
          name: name
        }))
      };
      // Only send this parties object, not legacy fields
      // Remove non-schema fields from advocates before sending
      // IMPORTANT: Joi validator (validation.js) only allows:
      // name (required), email (required), contact (required), company (optional), gst (optional), isLead (optional)
      // DO NOT send spock, poc, or level, even if required by backend Mongoose schema, or validation will fail.
      // If you want to require those fields, add them to the Joi validator too!
      const advocatesClean = (caseData.advocates || []).map(({name, email, contact, company, gst, spock, poc, level, isLead}) => ({
  name,
  email,
  contact,
  company: company || '',
  gst: gst || '',
  spock: spock || '',
  poc: poc || '',
  level: level || '',
  isLead: !!isLead
})); // includes all required fields
      const apiCaseData = {
        ...caseData,
        parties,
        advocates: advocatesClean,
        hearingDate: caseData.hearingDate ? caseData.hearingDate.toISOString() : null,
        filingDate: caseData.filingDate ? caseData.filingDate.toISOString() : new Date().toISOString(),
      }

      // API call to create a new case
      const newCase = await api.cases.create(apiCaseData)
      console.log("Case created:", newCase)

      // Upload documents if any are selected
      if (selectedFiles.length > 0) {
        try {
          await uploadDocuments(newCase.id || newCase._id)
          console.log('Documents uploaded successfully')
        } catch (uploadError) {
          console.error('Error uploading documents:', uploadError)
        }
      }

      // Show success message
      toast({
        title: "Case created successfully",
        description: "Your new case has been created and saved.",
      });
      router.push("/dashboard/cases?refresh=" + Date.now());
    } catch (error) {
      console.error("Error saving case:", error);

      toast({
        title: "Error creating case",
        description: "There was an error saving the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const districtOptions = DISTRICTS[caseData.courtState] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Case</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="court">Court Information</TabsTrigger>
              <TabsTrigger value="party">Party Section</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="advocates">Advocates</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                  <CardDescription>Enter the basic details about the case</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="case-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (rest of the JSX) */}
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
                    {/* Unified Party Type Dropdown for Petitioners */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Select
                          value={caseData.petitionerRole || 'Petitioner'}
                          onValueChange={val => setCaseData(prev => ({ ...prev, petitionerRole: val }))}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Petitioner">Petitioner</SelectItem>
                            <SelectItem value="Appellant">Appellant</SelectItem>
                            <SelectItem value="Plaintiff">Plaintiff</SelectItem>
                            <SelectItem value="Complainant">Complainant</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={() => setCaseData(prev => ({
                          ...prev,
                          petitioners: [...(prev.petitioners || []), { role: prev.petitionerRole || 'Petitioner', type: '', name: '' }]
                        }))}>
                          Add Party
                        </Button>
                      </div>
                      {caseData.petitioners && caseData.petitioners.length > 0 && (
                        <div className="space-y-2">
                          {caseData.petitioners.map((petitioner, idx) => (
                            <div key={idx} className="flex space-x-2 mb-2">
                              {/* Remove role dropdown, use selected role */}
                              <Input
                                value={petitioner.name}
                                onChange={e => {
                                  const arr = [...caseData.petitioners]; arr[idx].name = e.target.value; setCaseData(prev => ({ ...prev, petitioners: arr }));
                                }}
                                placeholder={`Enter ${petitioner.role || caseData.petitionerRole || 'Petitioner'} name`}
                              />
                              <Select
                                value={petitioner.type}
                                onValueChange={val => {
                                  const arr = [...caseData.petitioners]; arr[idx].type = val; setCaseData(prev => ({ ...prev, petitioners: arr }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Individual">Individual</SelectItem>
                                  <SelectItem value="Corporation">Corporation</SelectItem>
                                  <SelectItem value="Organization">Organization</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" onClick={() => setCaseData(prev => ({ ...prev, petitioners: prev.petitioners.filter((_, i) => i !== idx) }))}>Remove</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Unified Party Type Dropdown for Respondents */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Select
                          value={caseData.respondentRole || 'Respondent'}
                          onValueChange={val => setCaseData(prev => ({ ...prev, respondentRole: val }))}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Respondent">Respondent</SelectItem>
                            <SelectItem value="Accused">Accused</SelectItem>
                            <SelectItem value="Defendant">Defendant</SelectItem>
                            <SelectItem value="Opponent">Opponent</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={() => setCaseData(prev => ({
                          ...prev,
                          respondents: [...(prev.respondents || []), { role: prev.respondentRole || 'Respondent', type: '', name: '', opposingCounsel: '' }]
                        }))}>
                          Add Party
                        </Button>
                      </div>
                      {caseData.respondents && caseData.respondents.length > 0 && (
                        <div className="space-y-2">
                          {caseData.respondents.map((respondent, idx) => (
                            <div key={idx} className="flex space-x-2 mb-2">
                              {/* Remove role dropdown, use selected role */}
                              <Input
                                value={respondent.name}
                                onChange={e => {
                                  const arr = [...caseData.respondents]; arr[idx].name = e.target.value; setCaseData(prev => ({ ...prev, respondents: arr }));
                                }}
                                placeholder={`Enter ${respondent.role || caseData.respondentRole || 'Respondent'} name`}
                              />
                              <Select
                                value={respondent.type}
                                onValueChange={val => {
                                  const arr = [...caseData.respondents]; arr[idx].type = val; setCaseData(prev => ({ ...prev, respondents: arr }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Individual">Individual</SelectItem>
                                  <SelectItem value="Corporation">Corporation</SelectItem>
                                  <SelectItem value="Organization">Organization</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={respondent.opposingCounsel}
                                onChange={e => {
                                  const arr = [...caseData.respondents]; arr[idx].opposingCounsel = e.target.value; setCaseData(prev => ({ ...prev, respondents: arr }));
                                }}
                                placeholder="Opposing Counsel"
                              />
                              <Button variant="ghost" onClick={() => setCaseData(prev => ({ ...prev, respondents: prev.respondents.filter((_, i) => i !== idx) }))}>Remove</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>Cancel</Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Case"}</Button>
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
                      </div>
                    )}

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
             <TabsContent value="advocates">
              <Card>
                <CardHeader>
                  <CardTitle>Advocates Section</CardTitle>
                  <CardDescription>Add lead and associate advocates for this case (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(!caseData.advocates || caseData.advocates.length === 0) && (
                      <Button type="button" onClick={() => setCaseData(prev => ({ ...prev, advocates: [{ name: '', email: '', contact: '', company: '', gst: '', isLead: false }]}))}>
                        Add Advocate
                      </Button>
                    )}
                    {caseData.advocates && caseData.advocates.map((advocate, idx) => (
  <div key={idx} className="space-y-2 border p-3 rounded-md mb-2">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Input
        value={advocate.name}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].name = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Advocate Name"
        required
      />
      <Input
        type="email"
        value={advocate.email}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].email = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Email"
      />
      <Input
        value={advocate.contact}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].contact = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Contact"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Input
        value={advocate.company}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].company = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Company"
      />
      <Input
        value={advocate.gst}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].gst = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="GST"
      />
      <Input
        value={advocate.spock}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].spock = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Spock Number"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Input
        value={advocate.poc}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].poc = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        placeholder="Point of Contact"
      />
      <select
        value={advocate.level || ''}
        onChange={e => {
          const arr = [...caseData.advocates]; arr[idx].level = e.target.value; setCaseData(prev => ({ ...prev, advocates: arr }));
        }}
        className="border rounded px-2 py-1"
      >
        <option value="">Select Level</option>
        <option value="Senior">Senior</option>
        <option value="Junior">Junior</option>
      </select>
      <div className="flex items-center space-x-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={!!advocate.isLead}
            onChange={e => {
              const arr = [...caseData.advocates]; arr[idx].isLead = e.target.checked; setCaseData(prev => ({ ...prev, advocates: arr }));
            }}
            className="mr-2"
          />
          Lead Advocate
        </label>
        <Button variant="ghost" size="sm" onClick={() => setCaseData(prev => ({ ...prev, advocates: prev.advocates.filter((_, i) => i !== idx) }))}>Remove</Button>
      </div>
    </div>
  </div>
))}
                    {/* Save Case button for Advocates section */}
                    <div className="flex justify-end">
                      <Button type="submit" form="case-form" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Case"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
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
  );
}
