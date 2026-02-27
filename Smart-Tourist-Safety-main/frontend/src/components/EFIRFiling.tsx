// import React, { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { Progress } from "./ui/progress";
// import {
//   Upload,
//   CheckCircle,
//   ArrowLeft,
//   ArrowRight,
//   Send,
//   User,
//   AlertTriangle,
//   Paperclip,
// } from "lucide-react";
// import { createIncident } from "../api";

// type Step = "personal" | "incident" | "evidence" | "review";

// type FormData = {
//   fullName: string;
//   email: string;
//   phone: string;
//   nationality: string;
//   passportNumber: string;
//   currentAddress: string;
//   incidentType: string;
//   incidentDate: string;
//   incidentTime: string;
//   incidentLocation: string;
//   incidentDescription: string;
//   suspectDescription: string;
//   witnessDetails: string;
//   policeStation: string;
//   uploadedFiles: File[];
//   additionalNotes: string;
// };

// export function EFIRFiling() {
//   const [currentStep, setCurrentStep] = useState<Step>("personal");
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phone: "",
//     nationality: "",
//     passportNumber: "",
//     currentAddress: "",
//     incidentType: "",
//     incidentDate: "",
//     incidentTime: "",
//     incidentLocation: "",
//     incidentDescription: "",
//     suspectDescription: "",
//     witnessDetails: "",
//     policeStation: "",
//     uploadedFiles: [],
//     additionalNotes: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [policeStations, setPoliceStations] = useState<string[]>([]);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     const fetchPoliceStations = async () => {
//       try {
//         const token = localStorage.getItem("token") || "";
//         const res = await fetch("/api/police-stations", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch police stations");
//         const data = await res.json();
//         setPoliceStations(data.stations || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchPoliceStations();
//   }, []);

//   const steps = [
//     { id: "personal", title: "Personal Info", icon: User },
//     { id: "incident", title: "Incident Details", icon: AlertTriangle },
//     { id: "evidence", title: "Upload Evidence", icon: Upload },
//     { id: "review", title: "Review & Submit", icon: CheckCircle },
//   ];

//   const incidentTypes = [
//     "Theft/Robbery",
//     "Assault",
//     "Fraud/Scam",
//     "Lost Property",
//     "Harassment",
//     "Medical Emergency",
//     "Traffic Accident",
//     "Other",
//   ];

//   const getStepIndex = (step: Step) => steps.findIndex((s) => s.id === step);
//   const getProgressPercentage = () =>
//     ((getStepIndex(currentStep) + 1) / steps.length) * 100;

//   const nextStep = () => {
//     const currentIndex = getStepIndex(currentStep);
//     if (currentIndex < steps.length - 1) {
//       setCurrentStep(steps[currentIndex + 1].id as Step);
//     }
//   };

//   const prevStep = () => {
//     const currentIndex = getStepIndex(currentStep);
//     if (currentIndex > 0) {
//       setCurrentStep(steps[currentIndex - 1].id as Step);
//     }
//   };

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleTextInput =
//     (field: keyof FormData) =>
//     (
//       e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ): void => {
//       handleInputChange(field, e.target.value);
//     };

//   const handleFileUpload = (files: FileList | null) => {
//     if (!files) return;
//     setFormData((prev) => ({
//       ...prev,
//       uploadedFiles: [...prev.uploadedFiles, ...Array.from(files)],
//     }));
//   };

//   const removeFile = (file: File) => {
//     setFormData((prev) => ({
//       ...prev,
//       uploadedFiles: prev.uploadedFiles.filter((f) => f !== file),
//     }));
//   };

//   const triggerFileDialog = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsSubmitting(true);
//       const token = localStorage.getItem("token") || "";
//       const data = {
//         ...formData,
//         uploadedFiles: formData.uploadedFiles.map((f) => f.name),
//       };
//       const res = await createIncident(data, token);
//       console.log("Incident submitted:", res);
//       alert("Incident filed successfully!");
//       setIsSubmitting(false);
//       setFormData({
//         fullName: "",
//         email: "",
//         phone: "",
//         nationality: "",
//         passportNumber: "",
//         currentAddress: "",
//         incidentType: "",
//         incidentDate: "",
//         incidentTime: "",
//         incidentLocation: "",
//         incidentDescription: "",
//         suspectDescription: "",
//         witnessDetails: "",
//         policeStation: "",
//         uploadedFiles: [],
//         additionalNotes: "",
//       });
//       setCurrentStep("personal");
//     } catch (err: any) {
//       console.error("Error filing incident:", err.message);
//       setIsSubmitting(false);
//     }
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case "personal":
//         return (
//           <div className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label>Full Name *</Label>
//                 <Input
//                   value={formData.fullName}
//                   onChange={handleTextInput("fullName")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Nationality *</Label>
//                 <Input
//                   value={formData.nationality}
//                   onChange={handleTextInput("nationality")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email *</Label>
//                 <Input
//                   type="email"
//                   value={formData.email}
//                   onChange={handleTextInput("email")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Phone *</Label>
//                 <Input
//                   value={formData.phone}
//                   onChange={handleTextInput("phone")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Passport Number *</Label>
//                 <Input
//                   value={formData.passportNumber}
//                   onChange={handleTextInput("passportNumber")}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Current Address *</Label>
//               <Textarea
//                 rows={3}
//                 value={formData.currentAddress}
//                 onChange={handleTextInput("currentAddress")}
//               />
//             </div>
//           </div>
//         );

//       case "incident":
//         return (
//           <div className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label>Type of Incident *</Label>
//                 <Select
//                   value={formData.incidentType}
//                   onValueChange={(v: string) =>
//                     handleInputChange("incidentType", v)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select incident type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {incidentTypes.map((t) => (
//                       <SelectItem key={t} value={t}>
//                         {t}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Preferred Police Station</Label>
//                 <Select
//                   value={formData.policeStation}
//                   onValueChange={(v: string) =>
//                     handleInputChange("policeStation", v)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select police station" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {policeStations.map((s) => (
//                       <SelectItem key={s} value={s}>
//                         {s}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Date of Incident *</Label>
//                 <Input
//                   type="date"
//                   value={formData.incidentDate}
//                   onChange={handleTextInput("incidentDate")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Time of Incident *</Label>
//                 <Input
//                   type="time"
//                   value={formData.incidentTime}
//                   onChange={handleTextInput("incidentTime")}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Location of Incident *</Label>
//               <Input
//                 value={formData.incidentLocation}
//                 onChange={handleTextInput("incidentLocation")}
//                 placeholder="Street, landmark, area"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Detailed Description *</Label>
//               <Textarea
//                 rows={5}
//                 value={formData.incidentDescription}
//                 onChange={handleTextInput("incidentDescription")}
//               />
//             </div>
//           </div>
//         );

//       case "evidence":
//         return (
//           <div className="space-y-6">
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400">
//               <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="font-medium text-gray-900">
//                 Drop files here or click to upload
//               </p>

//               <input
//                 type="file"
//                 multiple
//                 className="hidden"
//                 ref={fileInputRef}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   handleFileUpload(e.target.files)
//                 }
//               />

//               <div className="flex justify-center mt-4 space-x-4">
//                 <Button variant="outline" onClick={triggerFileDialog}>
//                   <Paperclip className="h-4 w-4 mr-2" /> Choose Files
//                 </Button>
//               </div>
//             </div>

//             {formData.uploadedFiles.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-3">
//                   Uploaded Files
//                 </h4>
//                 <ul className="space-y-2">
//                   {formData.uploadedFiles.map((file, i) => (
//                     <li
//                       key={i}
//                       className="flex justify-between bg-gray-50 p-2 rounded"
//                     >
//                       {file.name}
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeFile(file)}
//                         className="text-red-600"
//                       >
//                         Remove
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         );

//       case "review":
//         return (
//           <div className="space-y-6">
//             <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
//               Review & Submit
//             </h3>
//             <div className="grid md:grid-cols-2 gap-6">
//               <Card className="p-4 bg-gray-50 shadow-sm">
//                 <p><strong>Full Name:</strong> {formData.fullName || "-"}</p>
//                 <p><strong>Email:</strong> {formData.email || "-"}</p>
//                 <p><strong>Phone:</strong> {formData.phone || "-"}</p>
//                 <p><strong>Nationality:</strong> {formData.nationality || "-"}</p>
//                 <p><strong>Passport Number:</strong> {formData.passportNumber || "-"}</p>
//                 <p><strong>Current Address:</strong> {formData.currentAddress || "-"}</p>
//               </Card>

//               <Card className="p-4 bg-gray-50 shadow-sm">
//                 <p><strong>Incident Type:</strong> {formData.incidentType || "-"}</p>
//                 <p><strong>Date & Time:</strong> {formData.incidentDate || "-"} {formData.incidentTime || "-"}</p>
//                 <p><strong>Location:</strong> {formData.incidentLocation || "-"}</p>
//                 <p><strong>Description:</strong> {formData.incidentDescription || "-"}</p>
//                 <p><strong>Suspect Description:</strong> {formData.suspectDescription || "-"}</p>
//                 <p><strong>Witness Details:</strong> {formData.witnessDetails || "-"}</p>
//                 <p><strong>Police Station:</strong> {formData.policeStation || "-"}</p>
//               </Card>
//             </div>

//             {formData.uploadedFiles.length > 0 && (
//               <Card className="p-4 bg-gray-50 shadow-sm">
//                 <p><strong>Uploaded Files:</strong></p>
//                 <ul className="list-disc list-inside ml-4">
//                   {formData.uploadedFiles.map((f, i) => (
//                     <li key={i}>{f.name}</li>
//                   ))}
//                 </ul>
//               </Card>
//             )}

//             <Card className="p-4 bg-gray-50 shadow-sm">
//               <p><strong>Additional Notes:</strong> {formData.additionalNotes || "-"}</p>
//             </Card>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4">
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <Progress value={getProgressPercentage()} />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>{steps.find((s) => s.id === currentStep)?.title}</CardTitle>
//         </CardHeader>
//         <CardContent>{renderStepContent()}</CardContent>
//       </Card>

//       <div className="flex justify-between mt-6">
//         <Button onClick={prevStep} disabled={currentStep === "personal"}>
//           <ArrowLeft className="h-4 w-4 mr-2" /> Previous
//         </Button>
//         {currentStep === "review" ? (
//           <Button
//             className="bg-green-600 hover:bg-green-700"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             <Send className="h-4 w-4 mr-2" />{" "}
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         ) : (
//           <Button onClick={nextStep}>
//             Next <ArrowRight className="h-4 w-4 ml-2" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import {
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  User,
  AlertTriangle,
  Paperclip,
} from "lucide-react";
import { createIncident } from "../api";

type Step = "personal" | "incident" | "evidence" | "review";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  currentAddress: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  suspectDescription: string;
  witnessDetails: string;
  policeStation: string;
  uploadedFiles: File[];
  additionalNotes: string;
};

export function EFIRFiling() {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    passportNumber: "",
    currentAddress: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    incidentDescription: "",
    suspectDescription: "",
    witnessDetails: "",
    policeStation: "",
    uploadedFiles: [],
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policeStations, setPoliceStations] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch police stations
  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch("/api/police-stations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch police stations");
        const data = await res.json();
        setPoliceStations(data.stations || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPoliceStations();
  }, []);

  // Get user's current location
  // useEffect(() => {
  //   if (!navigator.geolocation) return;
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setUserLocation({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     },
  //     (err) => {
  //       console.warn("Geolocation not allowed or failed:", err.message);
  //     }
  //   );
  // }, []);

  const steps = [
    { id: "personal", title: "Personal Info", icon: User },
    { id: "incident", title: "Incident Details", icon: AlertTriangle },
    { id: "evidence", title: "Upload Evidence", icon: Upload },
    { id: "review", title: "Review & Submit", icon: CheckCircle },
  ];

  const incidentTypes = [
    "Theft/Robbery",
    "Assault",
    "Fraud/Scam",
    "Lost Property",
    "Harassment",
    "Medical Emergency",
    "Traffic Accident",
    "Other",
  ];

  const getStepIndex = (step: Step) => steps.findIndex((s) => s.id === step);
  const getProgressPercentage = () =>
    ((getStepIndex(currentStep) + 1) / steps.length) * 100;

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1].id as Step);
  };
  const prevStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1].id as Step);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleTextInput =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleInputChange(field, e.target.value);
    };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...Array.from(files)],
    }));
  };
  const removeFile = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((f) => f !== file),
    }));
  };
  const triggerFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle final submission
  const handleSubmit = async () => {
  try {
    setIsSubmitting(true);

    const token = localStorage.getItem("token") || "";
    const API_URL = "http://localhost:5000/api";

    const formDataToSend = new FormData();

    // Append location
    formDataToSend.append(
      "location",
      JSON.stringify(userLocation || { lat: 0, lng: 0 })
    );

    // Append main description
    formDataToSend.append("description", formData.incidentDescription);

    // Append details
    const details = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      nationality: formData.nationality,
      passportNumber: formData.passportNumber,
      currentAddress: formData.currentAddress,
      incidentType: formData.incidentType,
      incidentDate: formData.incidentDate,
      incidentTime: formData.incidentTime,
      incidentLocation: formData.incidentLocation,
      policeStation: formData.policeStation,
      suspectDescription: formData.suspectDescription,
      witnessDetails: formData.witnessDetails,
      additionalNotes: formData.additionalNotes,
      type: "efir", // mark this as EFIR
    };
    formDataToSend.append("details", JSON.stringify(details));

    // Append uploaded files
    formData.uploadedFiles.forEach((file) => {
      formDataToSend.append("files", file);
    });

    const res = await fetch(`${API_URL}/incident/efir`, { // <-- send to /incidents/
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // do NOT set Content-Type manually
      },
      body: formDataToSend,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to submit EFIR: ${text}`);
    }

    const data = await res.json();
    console.log("EFIR submitted:", data);
    alert("E-FIR submitted successfully!");

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
      passportNumber: "",
      currentAddress: "",
      incidentType: "",
      incidentDate: "",
      incidentTime: "",
      incidentLocation: "",
      incidentDescription: "",
      suspectDescription: "",
      witnessDetails: "",
      policeStation: "",
      uploadedFiles: [],
      additionalNotes: "",
    });
    setCurrentStep("personal");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  } finally {
    setIsSubmitting(false);
  }
};





  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={formData.fullName} onChange={handleTextInput("fullName")} />
              </div>
              <div className="space-y-2">
                <Label>Nationality *</Label>
                <Input value={formData.nationality} onChange={handleTextInput("nationality")} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={handleTextInput("email")} />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input value={formData.phone} onChange={handleTextInput("phone")} />
              </div>
              <div className="space-y-2">
                <Label>Passport Number *</Label>
                <Input value={formData.passportNumber} onChange={handleTextInput("passportNumber")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Address *</Label>
              <Textarea rows={3} value={formData.currentAddress} onChange={handleTextInput("currentAddress")} />
            </div>
          </div>
        );
      case "incident":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Type of Incident *</Label>
                <Select
                  value={formData.incidentType}
                  onValueChange={(v: string) => handleInputChange("incidentType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Police Station</Label>
                <Select
                  value={formData.policeStation}
                  onValueChange={(v: string) => handleInputChange("policeStation", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select police station" />
                  </SelectTrigger>
                  <SelectContent>
                    {policeStations.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Incident *</Label>
                <Input type="date" value={formData.incidentDate} onChange={handleTextInput("incidentDate")} />
              </div>
              <div className="space-y-2">
                <Label>Time of Incident *</Label>
                <Input type="time" value={formData.incidentTime} onChange={handleTextInput("incidentTime")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location of Incident *</Label>
              <Input
                value={formData.incidentLocation}
                onChange={handleTextInput("incidentLocation")}
                placeholder="Street, landmark, area"
              />
            </div>
            <div className="space-y-2">
              <Label>Detailed Description *</Label>
              <Textarea rows={5} value={formData.incidentDescription} onChange={handleTextInput("incidentDescription")} />
            </div>
          </div>
        );
      case "evidence":
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-gray-900">Drop files here or click to upload</p>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="flex justify-center mt-4 space-x-4">
                <Button variant="outline" onClick={triggerFileDialog}>
                  <Paperclip className="h-4 w-4 mr-2" /> Choose Files
                </Button>
              </div>
            </div>
            {formData.uploadedFiles.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Uploaded Files</h4>
                <ul className="space-y-2">
                  {formData.uploadedFiles.map((file, i) => (
                    <li key={i} className="flex justify-between bg-gray-50 p-2 rounded">
                      {file.name}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file)} className="text-red-600">
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case "review":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Review & Submit</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gray-50 shadow-sm">
                <p><strong>Full Name:</strong> {formData.fullName || "-"}</p>
                <p><strong>Email:</strong> {formData.email || "-"}</p>
                <p><strong>Phone:</strong> {formData.phone || "-"}</p>
                <p><strong>Nationality:</strong> {formData.nationality || "-"}</p>
                <p><strong>Passport Number:</strong> {formData.passportNumber || "-"}</p>
                <p><strong>Current Address:</strong> {formData.currentAddress || "-"}</p>
              </Card>
              <Card className="p-4 bg-gray-50 shadow-sm">
                <p><strong>Incident Type:</strong> {formData.incidentType || "-"}</p>
                <p><strong>Date & Time:</strong> {formData.incidentDate || "-"} {formData.incidentTime || "-"}</p>
                <p><strong>Location:</strong> {formData.incidentLocation || "-"}</p>
                <p><strong>Description:</strong> {formData.incidentDescription || "-"}</p>
                <p><strong>Suspect Description:</strong> {formData.suspectDescription || "-"}</p>
                <p><strong>Witness Details:</strong> {formData.witnessDetails || "-"}</p>
                <p><strong>Police Station:</strong> {formData.policeStation || "-"}</p>
              </Card>
            </div>
            {formData.uploadedFiles.length > 0 && (
              <Card className="p-4 bg-gray-50 shadow-sm">
                <p><strong>Uploaded Files:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  {formData.uploadedFiles.map((f, i) => (<li key={i}>{f.name}</li>))}
                </ul>
              </Card>
            )}
            <Card className="p-4 bg-gray-50 shadow-sm">
              <p><strong>Additional Notes:</strong> {formData.additionalNotes || "-"}</p>
            </Card>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>EFIR Filing</CardTitle>
        <Progress value={getProgressPercentage()} className="mt-4" />
      </CardHeader>
      <CardContent>
        {renderStepContent()}
        <div className="flex justify-between mt-6">
          {currentStep !== "personal" && (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          )}
          {currentStep !== "review" ? (
            <Button onClick={nextStep}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"} <Send className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
