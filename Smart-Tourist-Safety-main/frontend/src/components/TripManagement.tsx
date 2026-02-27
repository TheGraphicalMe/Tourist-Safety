// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Calendar, MapPin, Clock, Phone, Activity } from "lucide-react";
// import { useTrips } from "../context/trip.context";
// import { createTrip, deleteTrip } from "../api";

// // ✅ Type definitions
// export interface Destination {
//   id: number;
//   place: string;
//   activity: string;
//   time: string;
//   duration: string;
// }

// export interface Stay {
//   id: number;
//   hotelName: string;
//   address: string;
//   checkIn: string;
//   checkOut: string;
// }

// export interface Trip {
//   _id?: string; // from backend
//   startLocation: string;
//   startDate: string;
//   endDate: string;
//   monitoringStart: string;
//   monitoringEnd: string;
//   destinations: Destination[];
//   stays: Stay[];
//   emergencyContact: string;
// }

// export function TripManagement() {
//   const { trips, refreshTrips } = useTrips();
//   const [isLoading, setIsLoading] = useState(false);

//   // Form state
//   const [startLocation, setStartLocation] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [monitoringStart, setMonitoringStart] = useState("");
//   const [monitoringEnd, setMonitoringEnd] = useState("");
//   const [emergencyContact, setEmergencyContact] = useState("");
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [stays, setStays] = useState<Stay[]>([]);

//   const token = localStorage.getItem("token") || "";

//   // Destination handlers
//   const handleAddDestination = () => {
//     setDestinations((prev) => [
//       ...prev,
//       { id: Date.now(), place: "", activity: "", time: "", duration: "" },
//     ]);
//   };
//   const handleUpdateDestination = (
//     id: number,
//     field: keyof Destination,
//     value: string
//   ) => {
//     setDestinations((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
//     );
//   };

//   // Stay handlers
//   const handleAddStay = () => {
//     setStays((prev) => [
//       ...prev,
//       { id: Date.now(), hotelName: "", address: "", checkIn: "", checkOut: "" },
//     ]);
//   };
//   const handleUpdateStay = (id: number, field: keyof Stay, value: string) => {
//     setStays((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
//   };

//   // Create trip
//   const handleAddItinerary = async () => {
//     if (!token) return alert("Login first!");
//     if (!startLocation || !startDate || !endDate)
//       return alert("⚠️ Fill starting location and dates");

//     const newTrip = {
//       startLocation,
//       startDate,
//       endDate,
//       monitoringStart,
//       monitoringEnd,
//       destinations: destinations.map((d) => ({
//         place: d.place,
//         activity: d.activity,
//         time: d.time,
//         duration: d.duration,
//       })),
//       stays: stays.map((s) => ({
//         hotelName: s.hotelName,
//         address: s.address,
//         checkIn: s.checkIn,
//         checkOut: s.checkOut,
//       })),
//       emergencyContact,
//     };

//     try {
//       setIsLoading(true);
//       await createTrip(newTrip, token);
//       await refreshTrips(); // ✅ update context so Dashboard sees new trip

//       // Reset form
//       setStartLocation("");
//       setStartDate("");
//       setEndDate("");
//       setMonitoringStart("");
//       setMonitoringEnd("");
//       setEmergencyContact("");
//       setDestinations([]);
//       setStays([]);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create trip");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete trip
//   const handleRemoveItinerary = async (id: string) => {
//     if (!token) return alert("Login first!");
//     try {
//       await deleteTrip(id, token);
//       await refreshTrips();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete trip");
//     }
//   };

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Activity className="h-8 w-8 animate-spin text-blue-600" />
//         <p className="ml-4 text-gray-600">Saving trip...</p>
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Add Trip Form */}
//       <Card className="mb-6 shadow-md border-0">
//         <CardHeader>
//           <CardTitle>Add New Trip</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-4">
//           <div className="flex items-center">
//             <MapPin className="h-5 w-5 text-blue-600 mr-2" />
//             <Input
//               placeholder="Starting Location"
//               value={startLocation}
//               onChange={(e) => setStartLocation(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <Input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Input
//               type="time"
//               value={monitoringStart}
//               onChange={(e) => setMonitoringStart(e.target.value)}
//               placeholder="Monitoring Start"
//             />
//             <Input
//               type="time"
//               value={monitoringEnd}
//               onChange={(e) => setMonitoringEnd(e.target.value)}
//               placeholder="Monitoring End"
//             />
//           </div>

//           {/* Destinations */}
//           <div>
//             <h2 className="font-semibold mb-2">Destinations</h2>
//             {destinations.map((d) => (
//               <div key={d.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
//                 <Input
//                   placeholder="Place"
//                   value={d.place}
//                   onChange={(e) => handleUpdateDestination(d.id, "place", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Activity"
//                   value={d.activity}
//                   onChange={(e) => handleUpdateDestination(d.id, "activity", e.target.value)}
//                 />
//                 <Input
//                   type="time"
//                   value={d.time}
//                   onChange={(e) => handleUpdateDestination(d.id, "time", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Duration"
//                   value={d.duration}
//                   onChange={(e) => handleUpdateDestination(d.id, "duration", e.target.value)}
//                 />
//               </div>
//             ))}
//             <Button variant="secondary" onClick={handleAddDestination}>
//               + Add Destination
//             </Button>
//           </div>

//           {/* Stays */}
//           <div>
//             <h2 className="font-semibold mb-2">Stays</h2>
//             {stays.map((s) => (
//               <div key={s.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
//                 <Input
//                   placeholder="Hotel Name"
//                   value={s.hotelName}
//                   onChange={(e) => handleUpdateStay(s.id, "hotelName", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Address"
//                   value={s.address}
//                   onChange={(e) => handleUpdateStay(s.id, "address", e.target.value)}
//                 />
//                 <Input
//                   type="date"
//                   value={s.checkIn}
//                   onChange={(e) => handleUpdateStay(s.id, "checkIn", e.target.value)}
//                 />
//                 <Input
//                   type="date"
//                   value={s.checkOut}
//                   onChange={(e) => handleUpdateStay(s.id, "checkOut", e.target.value)}
//                 />
//               </div>
//             ))}
//             <Button variant="secondary" onClick={handleAddStay}>
//               + Add Stay
//             </Button>
//           </div>

//           {/* Emergency Contact */}
//           <div className="flex items-center">
//             <Phone className="h-5 w-5 text-blue-600 mr-2" />
//             <Input
//               placeholder="Emergency Contact"
//               value={emergencyContact}
//               onChange={(e) => setEmergencyContact(e.target.value)}
//             />
//           </div>

//           <Button onClick={handleAddItinerary} className="w-full sm:w-auto">
//             Save Trip
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Trip List */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold text-gray-800">Your Trips</h2>
//         {trips.length === 0 ? (
//           <p className="text-gray-600 text-center py-8">No trips yet.</p>
//         ) : (
//           trips.map((trip) => (
//             <Card key={trip._id} className="shadow-md border-0">
//               <CardContent className="p-6 space-y-2">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-lg font-semibold">
//                     {trip.startLocation} ({trip.startDate} → {trip.endDate})
//                   </h2>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleRemoveItinerary(trip._id!)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   Monitoring: {trip.monitoringStart || "N/A"} → {trip.monitoringEnd || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Emergency Contact: {trip.emergencyContact || "Not provided"}
//                 </p>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  Activity, 
  CheckCircle, 
  X,
  Plus,
  Hotel,
  Navigation
} from "lucide-react";
import { useTrips } from "../context/trip.context";
import { createTrip, deleteTrip } from "../api";

// ✅ Type definitions
export interface Destination {
  id: number;
  place: string;
  activity: string;
  time: string;
  duration: string;
}

export interface Stay {
  id: number;
  hotelName: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

export interface Trip {
  _id?: string; // from backend
  startLocation: string;
  startDate: string;
  endDate: string;
  monitoringStart: string;
  monitoringEnd: string;
  destinations: Destination[];
  stays: Stay[];
  emergencyContact: string;
}

export function TripManagement() {
  const { trips, refreshTrips } = useTrips();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [startLocation, setStartLocation] = useState("");
  const [startLocationAdded, setStartLocationAdded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monitoringStart, setMonitoringStart] = useState("");
  const [monitoringEnd, setMonitoringEnd] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);

  // Temporary form state for adding destinations
  const [tempDestination, setTempDestination] = useState({
    place: "", activity: "", time: "", duration: ""
  });

  // Temporary form state for adding stays
  const [tempStay, setTempStay] = useState({
    hotelName: "", address: "", checkIn: "", checkOut: ""
  });

  const token = localStorage.getItem("token") || "";

  const handleSetStartLocation = () => {
    if (startLocation.trim()) {
      setStartLocationAdded(true);
    }
  };

  // Destination handlers
  const handleAddDestination = () => {
    if (tempDestination.place.trim() && tempDestination.activity.trim()) {
      const newDestination: Destination = {
        id: Date.now(),
        ...tempDestination
      };
      setDestinations(prev => [...prev, newDestination]);
      setTempDestination({ place: "", activity: "", time: "", duration: "" });
    } else {
      alert("Please fill in at least Place and Activity for the destination");
    }
  };

  const handleRemoveDestination = (id: number) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  // Stay handlers
  const handleAddStay = () => {
    if (tempStay.hotelName.trim() && tempStay.address.trim()) {
      const newStay: Stay = {
        id: Date.now(),
        ...tempStay
      };
      setStays(prev => [...prev, newStay]);
      setTempStay({ hotelName: "", address: "", checkIn: "", checkOut: "" });
    } else {
      alert("Please fill in at least Hotel Name and Address");
    }
  };

  const handleRemoveStay = (id: number) => {
    setStays(prev => prev.filter(s => s.id !== id));
  };

  // Create trip
  const handleAddItinerary = async () => {
    if (!token) return alert("Login first!");
    if (!startLocation || !startDate || !endDate)
      return alert("⚠️ Please fill Starting Location, Start Date, and End Date");

    const newTrip = {
      startLocation,
      startDate,
      endDate,
      monitoringStart,
      monitoringEnd,
      destinations: destinations.map((d) => ({
        place: d.place,
        activity: d.activity,
        time: d.time,
        duration: d.duration,
      })),
      stays: stays.map((s) => ({
        hotelName: s.hotelName,
        address: s.address,
        checkIn: s.checkIn,
        checkOut: s.checkOut,
      })),
      emergencyContact,
    };

    try {
      setIsLoading(true);
      await createTrip(newTrip, token);
      await refreshTrips(); // ✅ update context so Dashboard sees new trip

      // Reset form
      setStartLocation("");
      setStartLocationAdded(false);
      setStartDate("");
      setEndDate("");
      setMonitoringStart("");
      setMonitoringEnd("");
      setEmergencyContact("");
      setDestinations([]);
      setStays([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete trip
  const handleRemoveItinerary = async (id: string) => {
    if (!token) return alert("Login first!");
    try {
      await deleteTrip(id, token);
      await refreshTrips();
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Saving trip...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
        <p className="text-gray-600">Plan your travel itinerary in detail.</p>
      </div>

      {/* Add Trip Form */}
      <Card className="mb-6 shadow-lg border-0">
        <CardHeader>
          <CardTitle>Create New Itinerary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Starting Location Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <Input 
                  placeholder="Starting Location (e.g., Mumbai Airport)" 
                  value={startLocation} 
                  onChange={(e) => {
                    setStartLocation(e.target.value);
                    setStartLocationAdded(false);
                  }}
                />
              </div>
              <Button 
                onClick={handleSetStartLocation}
                disabled={!startLocation.trim() || startLocationAdded}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Set Start
              </Button>
            </div>
            {startLocationAdded && (
              <div className="flex items-center gap-2 ml-7">
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  <Navigation className="h-3 w-3 mr-1" />
                  Starting from: {startLocation}
                </Badge>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center flex-1">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex items-center flex-1">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Monitoring Times */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center flex-1">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <Input type="time" placeholder="Monitoring Start" value={monitoringStart} onChange={(e) => setMonitoringStart(e.target.value)} />
            </div>
            <div className="flex items-center flex-1">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <Input type="time" placeholder="Monitoring End" value={monitoringEnd} onChange={(e) => setMonitoringEnd(e.target.value)} />
            </div>
          </div>

          {/* Destinations Section */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              Destinations
            </h2>
            
            {/* Added Destinations Display */}
            {destinations.length > 0 && (
              <div className="space-y-2 mb-4">
                {destinations.map((dest, idx) => (
                  <div key={dest.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <div className="flex-1">
                      <Badge className="bg-blue-100 text-blue-700 mb-2">
                        Destination {idx + 1}
                      </Badge>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span><strong>Place:</strong> {dest.place}</span>
                        <span><strong>Activity:</strong> {dest.activity}</span>
                        {dest.time && <span><strong>Time:</strong> {dest.time}</span>}
                        {dest.duration && <span><strong>Duration:</strong> {dest.duration}</span>}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveDestination(dest.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Destination Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input 
                placeholder="Place/Location*" 
                value={tempDestination.place} 
                onChange={(e) => setTempDestination({...tempDestination, place: e.target.value})} 
              />
              <Input 
                placeholder="Activity*" 
                value={tempDestination.activity} 
                onChange={(e) => setTempDestination({...tempDestination, activity: e.target.value})} 
              />
              <Input 
                type="time" 
                placeholder="Time" 
                value={tempDestination.time} 
                onChange={(e) => setTempDestination({...tempDestination, time: e.target.value})} 
              />
              <Input 
                placeholder="Duration (e.g., 2 hours)" 
                value={tempDestination.duration} 
                onChange={(e) => setTempDestination({...tempDestination, duration: e.target.value})} 
              />
            </div>
            <Button 
              onClick={handleAddDestination} 
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Destination
            </Button>
          </div>

          {/* Stays Section */}
          <div className="space-y-4 bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg flex items-center">
              <Hotel className="h-5 w-5 text-green-600 mr-2" />
              Accommodation
            </h2>

            {/* Added Stays Display */}
            {stays.length > 0 && (
              <div className="space-y-2 mb-4">
                {stays.map((stay, idx) => (
                  <div key={stay.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <div className="flex-1">
                      <Badge className="bg-green-100 text-green-700 mb-2">
                        Stay {idx + 1}
                      </Badge>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span><strong>Hotel:</strong> {stay.hotelName}</span>
                        <span><strong>Address:</strong> {stay.address}</span>
                        {stay.checkIn && <span><strong>Check-in:</strong> {stay.checkIn}</span>}
                        {stay.checkOut && <span><strong>Check-out:</strong> {stay.checkOut}</span>}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveStay(stay.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Stay Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input 
                placeholder="Hotel Name*" 
                value={tempStay.hotelName} 
                onChange={(e) => setTempStay({...tempStay, hotelName: e.target.value})} 
              />
              <Input 
                placeholder="Address*" 
                value={tempStay.address} 
                onChange={(e) => setTempStay({...tempStay, address: e.target.value})} 
              />
              <Input 
                type="date" 
                placeholder="Check-in" 
                value={tempStay.checkIn} 
                onChange={(e) => setTempStay({...tempStay, checkIn: e.target.value})} 
              />
              <Input 
                type="date" 
                placeholder="Check-out" 
                value={tempStay.checkOut} 
                onChange={(e) => setTempStay({...tempStay, checkOut: e.target.value})} 
              />
            </div>
            <Button 
              onClick={handleAddStay} 
              variant="secondary"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Stay
            </Button>
          </div>

          {/* Emergency Contact */}
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-600 mr-2" />
            <Input 
              placeholder="Emergency Contact" 
              value={emergencyContact} 
              onChange={(e) => setEmergencyContact(e.target.value)} 
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleAddItinerary} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            disabled={!startLocationAdded || !startDate || !endDate}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Save Complete Itinerary
          </Button>
        </CardContent>
      </Card>

      {/* Trip List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Saved Itineraries</h2>
        {trips.length === 0 ? (
          <Card className="shadow-md border-0">
            <CardContent className="p-8 text-center text-gray-600">
              No itineraries saved yet. Create your first trip above!
            </CardContent>
          </Card>
        ) : (
          trips.map((trip) => (
            <Card key={trip._id} className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      {trip.startLocation}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {trip.startDate} → {trip.endDate}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveItinerary(trip._id!)}
                  >
                    Remove
                  </Button>
                </div>
                
                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Monitoring:</span>
                    <p className="text-gray-600">{trip.monitoringStart || "N/A"} → {trip.monitoringEnd || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Destinations:</span>
                    <p className="text-gray-600">{trip.destinations.length} location(s)</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Emergency:</span>
                    <p className="text-gray-600">{trip.emergencyContact || "Not provided"}</p>
                  </div>
                </div>

                {/* Show destinations if any */}
                {trip.destinations.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Planned Destinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.destinations.map((dest, idx) => (
                        <Badge key={idx} variant="secondary">
                          {dest.place}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}