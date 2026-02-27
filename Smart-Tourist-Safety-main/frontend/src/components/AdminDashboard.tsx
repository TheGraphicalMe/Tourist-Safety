import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Activity,
  Bell,
  Download,
  ExternalLink,
  FileText,
  Database,
  BarChart3
} from 'lucide-react';

// ✅ FIX: Define types for our data for better code quality and type safety
interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: 'blue' | 'orange' | 'red' | 'green'; // Be specific with colors
}

interface EvidenceLog {
  id: string;
  timestamp: string;
  tourist: string;
  incidentType: string;
  status: 'Under Investigation' | 'Resolved' | 'Closed';
  officer: string;
  location: string;
}

// ✅ FIX: Define the shape of our entire mock data object
interface MockData {
  metrics: Metric[];
  evidenceLogs: EvidenceLog[];
}

// MOCK API DATA - In a real app, this would come from a server
// ✅ FIX: Explicitly type the mockApiData object to ensure it matches our interfaces
const mockApiData: MockData = {
  metrics: [
    { title: 'Active Tourists', value: '2,847', change: '+12.5%', trend: 'up', icon: Users, color: 'blue' },
    { title: 'Active Alerts', value: '23', change: '-5.2%', trend: 'down', icon: AlertTriangle, color: 'orange' },
    { title: 'SOS in 24h', value: '7', change: '+2.1%', trend: 'up', icon: Shield, color: 'red' },
    { title: 'Avg Response Time', value: '4.2m', change: '-0.8m', trend: 'down', icon: Clock, color: 'green' }
  ],
  evidenceLogs: [
    { id: 'EFR-2024-001', timestamp: '2024-12-15 14:30:25', tourist: 'Sarah Johnson', incidentType: 'Theft', status: 'Under Investigation', officer: 'Inspector Sharma', location: 'Gateway of India' },
    { id: 'EFR-2024-002', timestamp: '2024-12-15 12:15:10', tourist: 'John Smith', incidentType: 'Lost Property', status: 'Resolved', officer: 'Constable Patel', location: 'Marine Drive' },
    { id: 'EFR-2024-003', timestamp: '2024-12-15 09:45:33', tourist: 'Maria Garcia', incidentType: 'Harassment', status: 'Under Investigation', officer: 'Inspector Kumar', location: 'Colaba Market' }
  ]
};

export function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [evidenceLogs, setEvidenceLogs] = useState<EvidenceLog[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = setTimeout(() => {
      // These lines will now work without error because the types are guaranteed to match
      setMetrics(mockApiData.metrics);
      setEvidenceLogs(mockApiData.evidenceLogs);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(fetchData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Investigation': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // ✅ FIX: Create a helper function for metric colors to avoid Tailwind CSS purging issues
  const getMetricColorClasses = (color: Metric['color']) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'green': return 'bg-green-100 text-green-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage tourist safety operations</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const colorClasses = getMetricColorClasses(metric.color); // Get color classes from helper
              return (
                <Card key={index} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses.split(' ')[0]}`}>
                        <Icon className={`h-6 w-6 ${colorClasses.split(' ')[1]}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                          <span className={`ml-2 text-sm ${
                            metric.trend === 'up' 
                              ? metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              : metric.change.startsWith('-') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evidence & Incident Logs</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-FIR ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Tourist</TableHead>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Officer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evidenceLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.id}</TableCell>
                        <TableCell className="text-sm">{log.timestamp}</TableCell>
                        <TableCell>{log.tourist}</TableCell>
                        <TableCell>{log.incidentType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.officer}</TableCell>
                        <TableCell>{log.location}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}