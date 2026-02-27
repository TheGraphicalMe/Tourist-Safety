import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { 
  CheckCircle, 
  FileText,
  MessageSquare,
  Calendar,
  Shield,
  Activity,
  Users,
  MapPin,
  Phone,
} from 'lucide-react';

// TypeScript types
interface TimelineStage { stage: string; status: 'completed' | 'active' | 'pending'; timestamp: string | null; description: string; officer: string; }
interface Evidence { type: string; name: string; uploadedBy: string; }
interface Update { timestamp: string; officer: string; message: string; type: string; }
interface Incident { id: number; efirId: string; tourist: string; nationality: string; type: string; severity: 'Critical' | 'High' | 'Medium' | 'Low'; status: 'Under Investigation' | 'Resolved' | 'Escalated' | 'Closed'; reportedAt: string; location: string; description: string; assignedOfficer: string; progress: number; timeline: TimelineStage[]; evidence: Evidence[]; updates: Update[]; }

// MOCK API DATA
const mockIncidentsData: Incident[] = [
  { id: 1, efirId: 'EFR-2024-001', tourist: 'Sarah Johnson', nationality: 'United States', type: 'Theft', severity: 'High', status: 'Under Investigation', reportedAt: '2024-12-15 14:30', location: 'Gateway of India, Mumbai', description: 'Tourist reported theft of passport and wallet. CCTV footage being reviewed.', assignedOfficer: 'Inspector Sharma', progress: 60,
    timeline: [
        { stage: 'Detection', status: 'completed', timestamp: '2024-12-15 14:30', description: 'E-FIR filed by tourist via app', officer: 'System' },
        { stage: 'Investigation', status: 'active', timestamp: '2024-12-15 15:30', description: 'CCTV footage review in progress', officer: 'Inspector Sharma' },
        { stage: 'Resolution', status: 'pending', timestamp: null, description: 'Pending investigation completion', officer: 'Inspector Sharma' }
    ],
    evidence: [{ type: 'CCTV', name: 'gateway_cctv_14:25.mp4', uploadedBy: 'Inspector Sharma' }],
    updates: [{ timestamp: '2024-12-15 16:45', officer: 'Inspector Sharma', message: 'Suspect identified, coordinating with local patrol.', type: 'progress' }]
  },
  { id: 2, efirId: 'EFR-2024-002', tourist: 'John Smith', nationality: 'United Kingdom', type: 'Lost Property', severity: 'Medium', status: 'Resolved', reportedAt: '2024-12-15 12:15', location: 'Marine Drive, Mumbai', description: 'Tourist lost mobile phone during evening walk. Device found by local vendor.', assignedOfficer: 'Constable Patel', progress: 100,
    timeline: [
        { stage: 'Detection', status: 'completed', timestamp: '2024-12-15 12:15', description: 'E-FIR filed for lost phone', officer: 'System' },
        { stage: 'Resolution', status: 'completed', timestamp: '2024-12-15 14:30', description: 'Phone recovered and returned', officer: 'Constable Patel' }
    ],
    evidence: [{ type: 'Photo', name: 'found_phone.jpg', uploadedBy: 'Constable Patel' }],
    updates: [{ timestamp: '2024-12-15 14:30', officer: 'Constable Patel', message: 'Case resolved successfully.', type: 'resolution' }]
  },
];

export function IncidentResolution() {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [newUpdate, setNewUpdate] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = setTimeout(() => {
      setIncidents(mockIncidentsData);
      if (mockIncidentsData.length > 0) {
        setSelectedIncidentId(mockIncidentsData[0].id);
      }
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(fetchData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Investigation': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageStatus = (stage: TimelineStage, incidentStatus: string) => {
    if (incidentStatus === "Resolved" && stage.status === "pending") {
      return "bg-green-600"; 
    }
    switch (stage.status) {
      case 'completed': return 'bg-green-600';
      case 'active': return 'bg-blue-600';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const handleSwitchStage = () => {
    if (!selectedIncidentId) return;

    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id !== selectedIncidentId) return incident;

        const currentIndex = incident.timeline.findIndex(s => s.status === "active");
        const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);

        if (currentIndex !== -1) {
          incident.timeline[currentIndex].status = "completed";
          incident.timeline[currentIndex].timestamp = timestamp;

          if (incident.timeline[currentIndex + 1]) {
            incident.timeline[currentIndex + 1].status = "active";
            incident.timeline[currentIndex + 1].timestamp = timestamp;
            incident.updates.push({
              timestamp,
              officer: "Inspector Sharma",
              message: `Moved to stage: ${incident.timeline[currentIndex + 1].stage}`,
              type: "progress",
            });
            incident.progress = Math.round(((currentIndex + 2) / incident.timeline.length) * 100);
          } else {
            incident.status = "Resolved";
            incident.progress = 100;
            incident.updates.push({
              timestamp,
              officer: "Inspector Sharma",
              message: "Case resolved.",
              type: "resolution",
            });
          }
        }
        return { ...incident };
      })
    );
  };

  const handleMarkResolved = () => {
    if (!selectedIncidentId) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const resolutionUpdate: Update = {
      timestamp,
      officer: "Inspector Sharma",
      message: "Case marked as resolved.",
      type: "resolution",
    };
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === selectedIncidentId
          ? { ...incident, status: "Resolved", progress: 100, updates: [...incident.updates, resolutionUpdate] }
          : incident
      )
    );
  };

  const handleAddUpdate = () => {
    if (!selectedIncidentId || !newUpdate.trim()) return; 
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);

    const update: Update = {
      timestamp,
      officer: "Inspector Sharma",
      message: newUpdate.trim(),
      type: "progress",
    };

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === selectedIncidentId
          ? { ...incident, updates: [...incident.updates, update] }
          : incident
      )
    );

    setNewUpdate("");
  };

  const selectedIncidentData = incidents.find(inc => inc.id === selectedIncidentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Loading Incident Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Incident Resolution Workflow</h1>
        <p className="text-gray-600 mt-1">Track and manage incident resolution from detection to closure</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedIncidentId === incident.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                    onClick={() => setSelectedIncidentId(incident.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{incident.efirId}</span>
                      <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{incident.tourist}</p>
                    <p className="text-xs text-gray-500">{incident.type}</p>
                    <div className="mt-2">
                      <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident Details */}
        <div className="lg:col-span-3">
          {selectedIncidentData ? (
            <div className="space-y-6">
              {/* Incident Overview Card */}
              <Card className="shadow-lg border-0">
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center">
                       <Shield className="h-5 w-5 mr-2" />
                       {selectedIncidentData.efirId} - {selectedIncidentData.type}
                     </CardTitle>
                     <div className="flex space-x-2">
                       <Button variant="outline" size="sm" onClick={handleSwitchStage}>
                         <MessageSquare className="h-4 w-4 mr-2" />
                         Updates
                       </Button>
                       <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleMarkResolved}>
                         <CheckCircle className="h-4 w-4 mr-2" />
                         Mark as Resolved
                       </Button>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <div>
                         <h4 className="font-semibold text-gray-900 mb-2">Tourist Information</h4>
                         <div className="space-y-2 text-sm">
                           <div className="flex items-center"><Users className="h-4 w-4 text-gray-400 mr-2" /><span>{selectedIncidentData.tourist} ({selectedIncidentData.nationality})</span></div>
                           <div className="flex items-center"><MapPin className="h-4 w-4 text-gray-400 mr-2" /><span>{selectedIncidentData.location}</span></div>
                           <div className="flex items-center"><Calendar className="h-4 w-4 text-gray-400 mr-2" /><span>Reported: {selectedIncidentData.reportedAt}</span></div>
                           <div className="flex items-center"><Phone className="h-4 w-4 text-gray-400 mr-2" /><span>Assigned: {selectedIncidentData.assignedOfficer}</span></div>
                         </div>
                       </div>
                       <div>
                         <h4 className="font-semibold text-gray-900 mb-2">Case Status</h4>
                         <div className="space-y-2">
                           <div className="flex items-center justify-between">
                             <Badge className={getStatusColor(selectedIncidentData.status)}>{selectedIncidentData.status}</Badge>
                             <Badge className={getSeverityColor(selectedIncidentData.severity)}>{selectedIncidentData.severity} Priority</Badge>
                           </div>
                           <div>
                             <div className="flex items-center justify-between mb-1">
                               <span className="text-sm text-gray-600">Progress</span>
                               <span className="text-sm font-medium text-gray-900">{selectedIncidentData.progress}%</span>
                             </div>
                             <Progress value={selectedIncidentData.progress} className="h-2" />
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="col-span-2 mt-4">
                       <h4 className="font-semibold text-gray-900 mb-2">Incident Description</h4>
                       <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">{selectedIncidentData.description}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

              {/* Resolution Workflow Card */}
              <Card className="shadow-lg border-0">
                <CardHeader><CardTitle>Resolution Workflow</CardTitle></CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-8 ml-6">
                      {selectedIncidentData.timeline.map((stage, index) => (
                        <div key={index} className="flex items-start gap-4 relative">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${getStageStatus(stage, selectedIncidentData.status)}`}>
                            {(stage.status === 'completed' || (selectedIncidentData.status === 'Resolved' && stage.status === 'pending')) && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                              {stage.timestamp && <span className="text-sm text-gray-500">{stage.timestamp}</span>}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{stage.description}</p>
                            <p className="text-xs text-gray-500">Officer: {stage.officer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates Card */}
              <Card className="shadow-lg border-0">
                 <CardHeader>
                   <CardTitle>Recent Updates</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {selectedIncidentData.updates.map((update, index) => (
                       <div key={index} className="border-l-2 border-blue-400 pl-4 py-2">
                         <div className="flex items-center justify-between mb-1">
                           <span className="font-medium text-sm text-gray-900">{update.officer}</span>
                           <span className="text-xs text-gray-500">{update.timestamp}</span>
                         </div>
                         <p className="text-sm text-gray-600">{update.message}</p>
                       </div>
                     ))}
                   </div>
                   <div className="mt-4 pt-4 border-t">
                     <Textarea
                       placeholder="Add a new update..."
                       rows={3}
                       className="mb-3"
                       value={newUpdate}
                       onChange={(e) => setNewUpdate(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === "Enter" && !e.shiftKey) {
                           e.preventDefault();
                           handleAddUpdate();
                         }
                       }}
                     />
                     <div className="flex justify-end">
                       <Button size="sm" onClick={handleAddUpdate}>
                         Add Update
                       </Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            </div>
          ) : (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <p>Select an incident from the list to view details.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
