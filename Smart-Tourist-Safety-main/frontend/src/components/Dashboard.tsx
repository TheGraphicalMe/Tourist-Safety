import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Shield,
  MapPin,
  Bell,
  Activity,
  Plane,
  AlertTriangle,
  Globe,
  Calendar,
  CalendarDays,
  MapPin as LocationIcon,
  Search,
  AlertCircle,
} from "lucide-react";
import { useTrips } from "../context/trip.context";
import { AppUser } from "../App";

interface ActivityLog {
  id: number;
  action: string;
  time: string;
}

export function Dashboard({ user }: { user: AppUser }) {
  const { trips } = useTrips();
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [daysTraveled, setDaysTraveled] = useState(0);

  // Update metrics and activity whenever trips change
  useEffect(() => {
    console.log("Trips updated:", trips);

    // Calculate total days traveled
    let totalDays = 0;
    trips.forEach((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      totalDays += Math.max(
        0,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );
    });
    setDaysTraveled(totalDays);

    // Build recent activity
    const recentActivity: ActivityLog[] = trips
      .map((t, idx) => ({
        id: idx + 1,
        action: `Trip to ${t.destinations?.[0]?.place || t.startLocation} scheduled`,
        time: t.startDate,
      }))
      .reverse(); // latest first
    setActivity(recentActivity);
  }, [trips]);

  // Quick action handlers
  const handleEmergency = () => alert("🚨 Emergency Alert Sent!");
  const handleShareLocation = () => alert("📍 Location shared with authorities!");
  const handleNearbyHelp = () => alert("🔍 Searching for nearby help...");

  // Upcoming trips (next 3)
  const upcomingTrips = trips
    .filter((t) => {
      const start = new Date(t.startDate);
      const today = new Date();
      // Include trips starting today or in the future
      return start >= new Date(today.setHours(0, 0, 0, 0));
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="mt-1 text-blue-100">
            Stay safe and enjoy your travels in {user.location || "Unknown"}.
          </p>
        </div>
        <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
          <p className="text-2xl font-bold">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-xs text-blue-100">Local Time</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Trips", value: trips.length.toString(), icon: Plane },
          { label: "Safety Alerts", value: "2", icon: AlertTriangle },
          {
            label: "Locations Visited",
            value: Array.from(
              new Set(
                trips
                  .flatMap((t) => t.destinations?.map((d) => d.place).filter(Boolean) || [])
                  .map((s) => s?.trim())
                  .filter(Boolean)
              )
            ).length.toString(),
            icon: Globe,
          },
          { label: "Days Traveled", value: daysTraveled.toString(), icon: Calendar },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card
              key={idx}
              className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-teal-50 hover:shadow-lg transition"
            >
              <CardContent className="p-6 flex flex-col items-center">
                <Icon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</h3>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Location", value: user.location || "Unknown", icon: MapPin },
          { label: "Role", value: user.role === "tourist" ? "Tourist" : "Authority", icon: Shield },
          { label: "Alerts", value: "2 Active", icon: Bell },
          { label: "System Health", value: "Normal", icon: Activity },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="shadow-md border-0 bg-white hover:shadow-lg transition">
              <CardContent className="p-6 flex flex-col items-center">
                <Icon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-gray-600">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Trips + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTrips.length === 0 ? (
              <p className="text-gray-600">No upcoming trips.</p>
            ) : (
              <div className="space-y-4">
                {upcomingTrips.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {t.destinations?.[0]?.place || t.startLocation}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t.startDate} → {t.endDate}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                      {new Date(t.startDate) > new Date() ? "Planning" : "Ongoing"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={handleEmergency}
              className="w-full flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Emergency Alert
            </button>
            <button
              onClick={handleShareLocation}
              className="w-full flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <LocationIcon className="h-5 w-5 mr-2" />
              Share Location
            </button>
            <button
              onClick={handleNearbyHelp}
              className="w-full flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Nearby Help
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-gray-600">No recent activity.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activity.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span className="text-gray-700">{item.action}</span>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
