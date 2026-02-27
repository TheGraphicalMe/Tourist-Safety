// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import {
//   AlertTriangle,
//   Phone,
//   MapPin,
//   FileText,
//   Share,
//   Clock,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';

// interface Incident {
//   id: number;
//   type: string;
//   date: string;
//   time: string;
//   status: string;
//   location: string;
//   description: string;
// }

// // 👇 Props definition so parent (App.tsx) can navigate
// interface IncidentResponseProps {
//   onNavigate?: (page: string) => void;
// }

// export function IncidentResponse({ onNavigate }: IncidentResponseProps) {
//   const [emergencyActive, setEmergencyActive] = useState(false);
//   const [panicPressed, setPanicPressed] = useState(false);
//   const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
//   const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

//   // fetch geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         pos => {
//           const { latitude, longitude } = pos.coords;
//           setLocation({
//             lat: latitude,
//             lng: longitude,
//             address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
//           });
//         },
//         () => {
//           setLocation({
//             lat: 18.9220,
//             lng: 72.8347,
//             address: 'Gateway of India, Mumbai'
//           });
//         }
//       );
//     }
//   }, []);

//   // helper to log new incidents
//   const logIncident = (type: string, location: string, description: string) => {
//     const now = new Date();
//     const newIncident: Incident = {
//       id: Date.now(),
//       type,
//       date: now.toISOString().split('T')[0],
//       time: now.toLocaleTimeString(),
//       status: 'Resolved',
//       location,
//       description
//     };
//     setRecentIncidents(prev => [newIncident, ...prev]);
//   };

//   const quickActions = [
//     {
//       title: 'Notify Emergency Services',
//       description: 'Alert local police and medical services',
//       icon: Phone,
//       color: 'bg-red-600 hover:bg-red-700',
//       action: () => {
//         logIncident('Emergency Services Notified', 'Local Police HQ', 'Notification sent to police & medical services');
//       }
//     },
//     {
//       title: 'File E-FIR',
//       description: 'Report incident to authorities online',
//       icon: FileText,
//       color: 'bg-blue-600 hover:bg-blue-700',
//       action: () => {
//         // log and redirect
//         logIncident('E-FIR Filed', 'Online Portal', 'Incident reported via digital FIR system');
//         onNavigate?.('efir');
//       }
//     },
//     {
//       title: 'Share Location',
//       description: 'Send real-time location to emergency contacts',
//       icon: Share,
//       color: 'bg-green-600 hover:bg-green-700',
//       action: () => {
//         logIncident('Location Shared', location?.address || 'Unknown', 'Shared with emergency contacts');
//       }
//     }
//   ];

//   const emergencyContacts = [
//     { type: 'Local Police', number: '100', description: 'Emergency police services', location: 'Mumbai, India' },
//     { type: 'Medical Emergency', number: '108', description: 'Ambulance and medical services', location: 'Mumbai, India' },
//     { type: 'Tourist Helpline', number: '+91 1363', description: '24/7 tourist assistance', location: 'India' },
//     { type: 'US Consulate', number: '+91 22 6672 4000', description: 'US citizen emergency services', location: 'Mumbai' }
//   ];

//   const handlePanicButton = () => {
//     setPanicPressed(true);
//     setEmergencyActive(true);
//     logIncident('Panic Alert', location?.address || 'Unknown', 'Emergency panic button pressed');
//     setTimeout(() => {
//       setPanicPressed(false);
//     }, 3000);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Emergency Response</h1>
//         <p className="text-gray-600 mt-1">Quick access to emergency services and incident reporting</p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Panic + Quick Actions + Map + Incidents */}
//         <div className="lg:col-span-2 space-y-6">

//           {/* Panic Button */}
//           <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
//             <CardContent className="p-8">
//               <div className="text-center">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Alert</h2>
//                 <div className="relative mb-6">
//                   <Button
//                     size="lg"
//                     onClick={handlePanicButton}
//                     disabled={panicPressed}
//                     className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
//                       panicPressed ? 'bg-red-800 animate-pulse' : 'bg-red-600 hover:bg-red-700 hover:scale-105'
//                     }`}
//                   >
//                     {panicPressed ? (
//                       <div className="flex flex-col items-center">
//                         <Clock className="h-8 w-8 mb-2" />
//                         <span className="text-sm">SENT</span>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center">
//                         <AlertTriangle className="h-8 w-8 mb-2" />
//                         <span>PANIC</span>
//                       </div>
//                     )}
//                   </Button>
//                   {emergencyActive && (
//                     <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
//                   )}
//                 </div>
//                 {emergencyActive && (
//                   <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
//                     <div className="flex items-center mb-2">
//                       <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//                       <span className="font-semibold text-gray-900">Emergency Alert Sent</span>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Your location has been shared with emergency services and contacts. Response ETA: ~5-8 min
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card className="shadow-lg border-0">
//             <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-3 gap-4">
//                 {quickActions.map((action, i) => {
//                   const Icon = action.icon;
//                   return (
//                     <Button
//                       key={i}
//                       className={`${action.color} text-white h-auto p-6 flex flex-col items-center space-y-3 hover:scale-105`}
//                       onClick={action.action}
//                     >
//                       <Icon className="h-8 w-8" />
//                       <div className="text-center">
//                         <div className="font-semibold">{action.title}</div>
//                         <div className="text-xs opacity-90 mt-1">{action.description}</div>
//                       </div>
//                     </Button>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Map */}
//           <Card className="shadow-lg border-0">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center">
//                 <MapPin className="h-5 w-5 mr-2" /> Current Location
//               </CardTitle>
//               <Badge className="bg-green-100 text-green-800">Location Active</Badge>
//             </CardHeader>
//             <CardContent>
//               <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
//                 <div className="relative z-10 text-center">
//                   <div className="bg-white rounded-full p-4 shadow-lg mb-4 inline-block">
//                     <MapPin className="h-8 w-8 text-red-600" />
//                   </div>
//                   <div className="bg-white rounded-lg p-4 shadow-lg">
//                     <h4 className="font-semibold text-gray-900">{location?.address || 'Fetching location...'}</h4>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : '...'}
//                     </p>
//                     <div className="flex items-center justify-center mt-2 text-xs text-green-600">
//                       <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
//                       Last updated: Just now
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Incidents */}
//           <Card className="shadow-lg border-0">
//             <CardHeader><CardTitle>Recent Incidents</CardTitle></CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentIncidents.length > 0 ? (
//                   recentIncidents.map(incident => (
//                     <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <div className="flex items-center space-x-2 mb-2">
//                             <Badge variant="outline">{incident.type}</Badge>
//                             <Badge className="bg-green-100 text-green-800">{incident.status}</Badge>
//                           </div>
//                           <h4 className="font-medium text-gray-900 mb-1">{incident.description}</h4>
//                           <div className="flex items-center space-x-4 text-sm text-gray-600">
//                             <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{incident.location}</span>
//                             <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{incident.date} at {incident.time}</span>
//                           </div>
//                         </div>
//                         <CheckCircle className="h-5 w-5 text-green-600" />
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                     <p>No recent incidents reported</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar Contacts */}
//         <div className="space-y-4">
//           <Card className="shadow-lg border-0">
//             <CardHeader><CardTitle className="text-lg">Emergency Contacts</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               {emergencyContacts.map((c, i) => (
//                 <div key={i} className="border border-gray-200 rounded-lg p-4">
//                   <h4 className="font-semibold text-gray-900">{c.type}</h4>
//                   <p className="text-sm text-gray-600">{c.description}</p>
//                   <p className="text-xs text-gray-500">{c.location}</p>
//                   <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-3">
//                     <Phone className="h-4 w-4 mr-2" /> Call {c.number}
//                   </Button>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-teal-50">
//             <CardContent className="p-6 text-center">
//               <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
//               <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
//               <ul className="text-sm text-gray-600 text-left space-y-1">
//                 <li>• Keep emergency contacts updated</li>
//                 <li>• Share your location with trusted contacts</li>
//                 <li>• Carry copies of important documents</li>
//                 <li>• Know local emergency numbers</li>
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertTriangle,
  Phone,
  MapPin,
  FileText,
  Share,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Incident {
  id: number;
  type: string;
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
}

// 👇 Props definition so parent (App.tsx) can navigate
interface IncidentResponseProps {
  onNavigate?: (page: string) => void;
}

export function IncidentResponse({ onNavigate }: IncidentResponseProps) {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [panicPressed, setPanicPressed] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // fetch geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          });
        },
        () => {
          setLocation({
            lat: 18.9220,
            lng: 72.8347,
            address: 'Gateway of India, Mumbai'
          });
        }
      );
    }
  }, []);

  // helper to log new incidents
  const logIncident = (type: string, location: string, description: string) => {
    const now = new Date();
    const newIncident: Incident = {
      id: Date.now(),
      type,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString(),
      status: 'Resolved',
      location,
      description
    };
    setRecentIncidents(prev => [newIncident, ...prev]);
  };

  const quickActions = [
    {
      title: 'Notify Emergency Services',
      description: 'Alert local police and medical services',
      icon: Phone,
      color: 'bg-red-600 hover:bg-red-700',
      action: () => {
        logIncident('Emergency Services Notified', 'Local Police HQ', 'Notification sent to police & medical services');
      }
    },
    {
      title: 'File E-FIR',
      description: 'Report incident to authorities online',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        // log and redirect
        logIncident('E-FIR Filed', 'Online Portal', 'Incident reported via digital FIR system');
        onNavigate?.('efir');
      }
    },
    {
      title: 'Share Location',
      description: 'Send real-time location to emergency contacts',
      icon: Share,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        logIncident('Location Shared', location?.address || 'Unknown', 'Shared with emergency contacts');
      }
    }
  ];

  const emergencyContacts = [
    { type: 'Kaushal', number: '+919608199425', description: 'Kaushal', location: 'Mumbai, India' },
    { type: 'Priyanshu', number: '+917081833829', description: 'Ambulance and medical services', location: 'Mumbai, India' }
  ];

  const defaultEmergencyNumber = emergencyContacts[0]?.number || '+919608199425';

  const handlePanicButton = () => {
    setPanicPressed(true);
    setEmergencyActive(true);
    logIncident('Panic Alert', location?.address || 'Unknown', 'Emergency panic button pressed');
    setCountdown(5); // start countdown from 5
  };

  const cancelPanic = () => {
    setCountdown(null);
    setPanicPressed(false);
    setEmergencyActive(false);
  };

  // countdown + call effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      window.location.href = `tel:${defaultEmergencyNumber}`;
      setCountdown(null);
      setPanicPressed(false);
      return;
    }

    // 🔔 Beep sound
    const audio = new Audio('/beep.mp3'); // put beep.mp3 in public folder
    audio.play().catch(() => {
      // ignore autoplay block
    });

    // 📳 Vibrate (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, defaultEmergencyNumber]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Response</h1>
        <p className="text-gray-600 mt-1">Quick access to emergency services and incident reporting</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panic + Quick Actions + Map + Incidents */}
        <div className="lg:col-span-2 space-y-6">

          {/* Panic Button */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Alert</h2>
                <div className="relative mb-6">
                  <Button
                    size="lg"
                    onClick={handlePanicButton}
                    disabled={panicPressed}
                    className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
                      panicPressed ? 'bg-red-800 animate-pulse' : 'bg-red-600 hover:bg-red-700 hover:scale-105'
                    }`}
                  >
                    {panicPressed ? (
                      countdown !== null ? (
                        <div className="flex flex-col items-center">
                          <Clock className="h-8 w-8 mb-1" />
                          <span className="text-xs mb-1">
                            Calling {defaultEmergencyNumber} in {countdown}s
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelPanic();
                            }}
                            className="text-xs bg-white text-red-600 font-semibold px-2 py-1 rounded mt-1 shadow"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Clock className="h-8 w-8 mb-2" />
                          <span className="text-sm">Calling {defaultEmergencyNumber}...</span>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <span>PANIC</span>
                      </div>
                    )}
                  </Button>
                  {emergencyActive && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                  )}
                </div>
                {emergencyActive && (
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-gray-900">Emergency Alert Sent</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your location has been shared with emergency services and contacts. Response ETA: ~5-8 min
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={i}
                      className={`${action.color} text-white h-auto p-6 flex flex-col items-center space-y-3 hover:scale-105`}
                      onClick={action.action}
                    >
                      <Icon className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">{action.title}</div>
                        <div className="text-xs opacity-90 mt-1">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" /> Current Location
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Location Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
                <div className="relative z-10 text-center">
                  <div className="bg-white rounded-full p-4 shadow-lg mb-4 inline-block">
                    <MapPin className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <h4 className="font-semibold text-gray-900">{location?.address || 'Fetching location...'}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : '...'}
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Last updated: Just now
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card className="shadow-lg border-0">
            <CardHeader><CardTitle>Recent Incidents</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.length > 0 ? (
                  recentIncidents.map(incident => (
                    <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{incident.type}</Badge>
                            <Badge className="bg-green-100 text-green-800">{incident.status}</Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{incident.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{incident.location}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{incident.date} at {incident.time}</span>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No recent incidents reported</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Contacts */}
        <div className="space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader><CardTitle className="text-lg">Emergency Contacts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{c.type}</h4>
                  <p className="text-sm text-gray-600">{c.description}</p>
                  <p className="text-xs text-gray-500">{c.location}</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-3">
                    <Phone className="h-4 w-4 mr-2" /> Call {c.number}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-teal-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Keep emergency contacts updated</li>
                <li>• Share your location with trusted contacts</li>
                <li>• Carry copies of important documents</li>
                <li>• Know local emergency numbers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
