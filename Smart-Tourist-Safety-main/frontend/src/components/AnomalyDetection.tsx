import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Activity,
  Navigation,
  PhoneOff,
  TrendingUp,
  ExternalLink,
  Filter,
  Bell
} from 'lucide-react';

// Define TypeScript types for all our data structures
interface RouteDeviation {
  id: number; tourist: string; nationality: string; expectedRoute: string; actualRoute: string; deviation: string; duration: string; riskLevel: 'High' | 'Medium' | 'Low'; timestamp: string; lastKnownLocation: string;
}
interface DistressSignal {
  id: number; tourist: string; nationality: string; alertType: string; location: string; timestamp: string; duration: string; riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'; responseStatus: string;
}
interface InactivityAlert {
  id: number; tourist: string; nationality: string; lastActivity: string; lastLocation: string; inactiveDuration: string; riskLevel: 'High' | 'Medium' | 'Low'; expectedActivity: string; timestamp: string; contactAttempts: number;
}
interface RiskAlert {
  id: number; type: string; tourist: string; location: string; riskLevel: 'High' | 'Medium' | 'Low'; description: string; recommendation: string; timestamp: string;
}

interface MockAnomalyData {
    routeDeviations: RouteDeviation[];
    distressSignals: DistressSignal[];
    inactivityAlerts: InactivityAlert[];
    riskAlerts: RiskAlert[];
}

// MOCK API DATA
const mockAnomalyData: MockAnomalyData = {
  routeDeviations: [
    { id: 1, tourist: 'Sarah Johnson', nationality: 'US', expectedRoute: 'Hotel → Gateway of India', actualRoute: 'Hotel → Unknown Area', deviation: '2.5 km', duration: '45 minutes', riskLevel: 'High', timestamp: '2024-12-15 14:30', lastKnownLocation: 'Dharavi Slum Area' },
  ],
  distressSignals: [
    { id: 1, tourist: 'David Wilson', nationality: 'Canada', alertType: 'Panic Button', location: 'Gateway of India', timestamp: '2024-12-15 15:45', duration: '5 minutes ago', riskLevel: 'Critical', responseStatus: 'Team Dispatched' },
  ],
  inactivityAlerts: [
    { id: 1, tourist: 'Emma Thompson', nationality: 'UK', lastActivity: '6 hours ago', lastLocation: 'Marine Drive Hotel', inactiveDuration: '6h 23m', riskLevel: 'Medium', expectedActivity: 'City Tour', timestamp: '2024-12-15 09:22', contactAttempts: 3 },
  ],
  riskAlerts: [
    { id: 1, type: 'High Crime Area Entry', tourist: 'Multiple (12 tourists)', location: 'Dharavi Area', riskLevel: 'High', description: 'Tourists entered area with elevated crime stats', recommendation: 'Increase patrol, send advisory', timestamp: '2 hours ago' },
  ]
};

export function AnomalyDetection() {
  const [selectedTab, setSelectedTab] = useState('route');
  const [isLoading, setIsLoading] = useState(true);

  const [routeDeviations, setRouteDeviations] = useState<RouteDeviation[]>([]);
  const [distressSignals, setDistressSignals] = useState<DistressSignal[]>([]);
  const [inactivityAlerts, setInactivityAlerts] = useState<InactivityAlert[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = setTimeout(() => {
      setRouteDeviations(mockAnomalyData.routeDeviations);
      setDistressSignals(mockAnomalyData.distressSignals);
      setInactivityAlerts(mockAnomalyData.inactivityAlerts);
      setRiskAlerts(mockAnomalyData.riskAlerts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(fetchData);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Critical': case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Analyzing Anomaly Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection & Risk Alerts</h1>
        <p className="text-gray-600 mt-1">Monitor tourist behavior patterns and detect potential safety risks</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="route" className="flex items-center gap-2"><Navigation className="h-4 w-4" />Route Deviation</TabsTrigger>
          <TabsTrigger value="distress" className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Distress</TabsTrigger>
          <TabsTrigger value="inactivity" className="flex items-center gap-2"><PhoneOff className="h-4 w-4" />Inactivity</TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Risk Alerts</TabsTrigger>
        </TabsList>
        
        {/* ✅ FIX: Added the display logic back for this tab */}
        <TabsContent value="route" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Route Deviation Alerts</h2>
            {routeDeviations.map((deviation) => (
              <Card key={deviation.id} className="shadow-lg border-0">
                <CardContent className="p-6">
                   <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskIcon(deviation.riskLevel)}`}></div>
                          <Badge className={getRiskColor(deviation.riskLevel)}>{deviation.riskLevel} Risk</Badge>
                          <Badge variant="outline">{deviation.nationality}</Badge>
                          <span className="text-sm text-gray-500">{deviation.timestamp}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{deviation.tourist}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><span className="font-medium text-gray-700">Expected:</span><p className="text-gray-600">{deviation.expectedRoute}</p></div>
                            <div><span className="font-medium text-gray-700">Actual:</span><p className="text-gray-600">{deviation.actualRoute}</p></div>
                          </div>
                          <div className="flex items-center space-x-6 text-gray-600">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{deviation.deviation}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{deviation.duration}</span>
                          </div>
                          <div className="bg-gray-50 rounded p-3"><span className="font-medium text-gray-700">Last Location:</span><p className="text-gray-600">{deviation.lastKnownLocation}</p></div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Bell className="h-4 w-4 mr-2" />Contact</Button>
                        <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                      </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ✅ FIX: Added the display logic back for this tab */}
        <TabsContent value="distress" className="mt-6">
           <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Distress Signals</h2>
              {distressSignals.map((signal) => (
                <Card key={signal.id} className={`shadow-lg border-0 border-l-4 ${signal.riskLevel === 'Critical' ? 'border-l-red-500' : 'border-l-orange-500'}`}>
                   <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskIcon(signal.riskLevel)} animate-pulse`}></div>
                          <Badge className={getRiskColor(signal.riskLevel)}>{signal.riskLevel}</Badge>
                          <Badge variant="outline">{signal.alertType}</Badge>
                          <span className="text-sm text-gray-500">{signal.duration}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{signal.tourist} ({signal.nationality})</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{signal.location}</span>
                             <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{signal.timestamp}</span>
                          </div>
                           <div className="bg-blue-50 rounded p-3 border-l-2 border-blue-400">
                            <span className="font-medium text-blue-900">Response Status:</span>
                            <p className="text-blue-800">{signal.responseStatus}</p>
                          </div>
                        </div>
                      </div>
                       <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700"><AlertTriangle className="h-4 w-4 mr-2" />Escalate</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>
        
        <TabsContent value="inactivity" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Inactivity Monitoring</h2>
            {inactivityAlerts.map((alert) => (
              <Card key={alert.id} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getRiskIcon(alert.riskLevel)}`}></div>
                        <Badge className={getRiskColor(alert.riskLevel)}>{alert.riskLevel} Risk</Badge>
                        <Badge variant="outline">{alert.nationality}</Badge>
                        <span className="text-sm text-gray-500">Inactive: {alert.inactiveDuration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.tourist}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">Last Activity:</span>
                            <p className="text-gray-600">{alert.lastActivity} at {alert.timestamp}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Expected Activity:</span>
                            <p className="text-gray-600">{alert.expectedActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-gray-600">
                          <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />Last Location: {alert.lastLocation}</span>
                          <span className="flex items-center"><PhoneOff className="h-3 w-3 mr-1" />Contact Attempts: {alert.contactAttempts}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700"><Users className="h-4 w-4 mr-2" />Send Welfare Check</Button>
                      <Button variant="outline" size="sm">Contact Emergency</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
           <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">General Risk Alerts</h2>
              {riskAlerts.map((risk) => (
                <Card key={risk.id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskIcon(risk.riskLevel)}`}></div>
                          <Badge className={getRiskColor(risk.riskLevel)}>{risk.riskLevel}</Badge>
                          <span className="text-sm text-gray-500">{risk.timestamp}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{risk.type}</h3>
                        <div className="space-y-3 text-sm">
                          <div><span className="font-medium text-gray-700">Affected:</span><p className="text-gray-600">{risk.tourist}</p></div>
                          <div><span className="font-medium text-gray-700">Location:</span><p className="text-gray-600">{risk.location}</p></div>
                          <div><span className="font-medium text-gray-700">Description:</span><p className="text-gray-600">{risk.description}</p></div>
                          <div className="bg-blue-50 rounded p-3 border-l-2 border-blue-400">
                            <span className="font-medium text-blue-900">Recommended Action:</span>
                            <p className="text-blue-800">{risk.recommendation}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Take Action</Button>
                        <Button variant="outline" size="sm">Dismiss</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}