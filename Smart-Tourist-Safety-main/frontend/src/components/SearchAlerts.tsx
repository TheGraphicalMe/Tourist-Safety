import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Map,
  List,
  ExternalLink,
  Calendar,
  Activity // Added for loading spinner
} from 'lucide-react';

// ✅ Define a TypeScript type for our Alert data structure
interface Alert {
  id: number;
  title: string;
  type: 'Weather' | 'Traffic' | 'Security' | 'Event' | 'Safety' | 'Health';
  severity: 'Critical' | 'Moderate' | 'Low';
  location: string;
  city: string;
  description: string;
  time: string;
  expires: string;
  affectedTourists: number;
}

// ✅ MOCK API DATA - In a real app, this would come from a server
const mockAlertsData: Alert[] = [
    { id: 1, title: 'Heavy Rainfall Warning', type: 'Weather', severity: 'Critical', location: 'Mumbai City Center', city: 'Mumbai', description: 'Heavy monsoon rains expected. Avoid low-lying areas.', time: '2 hours ago', expires: '2024-12-20', affectedTourists: 245 },
    { id: 2, title: 'Road Construction Advisory', type: 'Traffic', severity: 'Moderate', location: 'Marine Drive', city: 'Mumbai', description: 'Major road construction causing delays.', time: '4 hours ago', expires: '2024-12-25', affectedTourists: 89 },
    { id: 3, title: 'Increased Security Measures', type: 'Security', severity: 'Critical', location: 'Dharavi Area', city: 'Mumbai', description: 'Enhanced security protocols in effect.', time: '6 hours ago', expires: '2024-12-18', affectedTourists: 156 },
    { id: 6, title: 'Pollution Alert', type: 'Health', severity: 'Moderate', location: 'Delhi City Center', city: 'Delhi', description: 'Air quality index reaching unhealthy levels.', time: '1 day ago', expires: '2024-12-19', affectedTourists: 445 }
];

export function SearchAlerts() {
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // ✅ This useEffect hook simulates fetching data when the component loads
  useEffect(() => {
    setIsLoading(true);
    const fetchData = setTimeout(() => {
      setAlerts(mockAlertsData);
      setIsLoading(false);
    }, 1500); // Simulate 1.5 second network delay

    return () => clearTimeout(fetchData);
  }, []); // Empty array ensures this runs only once on mount

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'Moderate': return 'bg-orange-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // ✅ This filtering logic now works on the dynamic `alerts` state
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || alert.city === cityFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    
    return matchesSearch && matchesCity && matchesSeverity && matchesType;
  });

  // ✅ A loading state to show while data is being "fetched"
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Loading Alerts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search & Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor safety alerts and search locations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4 mr-2" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('map')}>
            <Map className="h-4 w-4 mr-2" /> Map
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-0 mb-6">
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search alerts, locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger><SelectContent><SelectItem value="all">All Cities</SelectItem><SelectItem value="Mumbai">Mumbai</SelectItem><SelectItem value="Delhi">Delhi</SelectItem></SelectContent></Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}><SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger><SelectContent><SelectItem value="all">All Severities</SelectItem><SelectItem value="Critical">Critical</SelectItem><SelectItem value="Moderate">Moderate</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Weather">Weather</SelectItem><SelectItem value="Traffic">Traffic</SelectItem><SelectItem value="Security">Security</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Alerts ({filteredAlerts.length})</h2>
              {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                <Card key={alert.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityIcon(alert.severity)}`}></div>
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                          <span className="text-sm text-gray-500">{alert.time}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                        <p className="text-gray-600 mb-3">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{alert.location}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />Expires: {alert.expires}</span>
                            <span className="flex items-center"><AlertTriangle className="h-3 w-3 mr-1" />{alert.affectedTourists} affected</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card className="shadow-lg border-0"><CardContent className="p-12 text-center"><AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3><p className="text-gray-600">Try adjusting your search criteria or filters.</p></CardContent></Card>
              )}
            </div>
          ) : (
            <Card className="shadow-lg border-0 h-[500px]">
              <CardHeader><CardTitle>Alert Locations Map</CardTitle></CardHeader>
              <CardContent><div className="h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Map View Here</div></CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="shadow-lg border-0 sticky top-24">
            <CardHeader><CardTitle className="text-lg">Alert Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Critical Alerts</span><Badge className="bg-red-100 text-red-800">{alerts.filter(a => a.severity === 'Critical').length}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Moderate Alerts</span><Badge className="bg-orange-100 text-orange-800">{alerts.filter(a => a.severity === 'Moderate').length}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Low Priority</span><Badge className="bg-green-100 text-green-800">{alerts.filter(a => a.severity === 'Low').length}</Badge></div>
              <div className="border-t pt-4"><div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-900">Total Affected Tourists</span><span className="text-lg font-bold text-blue-600">{alerts.reduce((sum, alert) => sum + alert.affectedTourists, 0)}</span></div></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}