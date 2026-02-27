import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { LandingPage } from "./components/LandingPage";
import { TouristProfile } from "./components/TouristProfile";
import { TripManagement } from "./components/TripManagement";
import { IncidentResponse } from "./components/IncidentResponse";
import { Dashboard } from "./components/Dashboard";
import { SearchAlerts } from "./components/SearchAlerts";
import { EFIRFiling } from "./components/EFIRFiling";
import { AdminDashboard } from "./components/AdminDashboard";
import { AnomalyDetection } from "./components/AnomalyDetection";
import { IncidentResolution } from "./components/IncidentResolution";
import { Login } from "./components/Login";
import { getMe } from "./api"; // ✅ lowercase api.ts

import {
  Menu,
  Shield,
  Home,
  User as UserIcon,
  Users,
  AlertTriangle,
  Search,
  FileText,
  Settings,
  Activity,
  IdCard,
} from "lucide-react";

// All page types
export type Page =
  | "landing"
  | "login"
  | "profile"
  | "digitalid"
  | "trips"
  | "incident"
  | "dashboard"
  | "search"
  | "efir"
  | "admin"
  | "anomaly"
  | "resolution";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "tourist" | "admin";
  location?: string;
  idProof?: {
    type: "Aadhaar" | "Passport" | "License";
    number: string;
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  // Auto login
  useEffect(() => {
    if (token) {
      getMe(token)
        .then((res) => {
          setUser(res.user);
          setCurrentPage(res.user.role === "admin" ? "admin" : "dashboard");
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setCurrentPage("landing");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Navbar scrolling hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sidebar pages (Digital ID will become external link)
  const touristPages = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "digitalid", label: "Digital ID", icon: IdCard }, // will open localhost:3001
    { id: "trips", label: "My Trips", icon: Users },
    { id: "incident", label: "Emergency", icon: AlertTriangle },
    { id: "search", label: "Search & Alerts", icon: Search },
    { id: "efir", label: "File E-FIR", icon: FileText },
  ];

  const adminPages = [
    { id: "admin", label: "Admin Dashboard", icon: Settings },
    { id: "anomaly", label: "Anomaly Detection", icon: Activity },
    { id: "resolution", label: "Incident Resolution", icon: Shield },
    { id: "search", label: "Search & Alerts", icon: Search },
  ];

  const getCurrentPages = () =>
    user?.role === "admin" ? adminPages : touristPages;

  // Page renderer (no longer showing <BlockchainDigitalID />!)
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={() => setCurrentPage("login")} />;
      case "login":
        return (
          <Login
            onLoginSuccess={(loggedUser: AppUser, apiToken: string) => {
              setUser(loggedUser);
              setToken(apiToken);
              localStorage.setItem("token", apiToken);
              setCurrentPage(
                loggedUser.role === "admin" ? "admin" : "dashboard"
              );
            }}
          />
        );
      case "profile":
        return user ? (
          <TouristProfile user={user} />
        ) : (
          <LandingPage onGetStarted={() => setCurrentPage("login")} />
        );
      case "trips":
        return <TripManagement />;
      case "incident":
        return (
          <IncidentResponse
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        );
      case "dashboard":
        return user ? (
          <Dashboard user={user} />
        ) : (
          <LandingPage onGetStarted={() => setCurrentPage("login")} />
        );
      case "search":
        return <SearchAlerts />;
      case "efir":
        return <EFIRFiling />;
      case "admin":
        return <AdminDashboard />;
      case "anomaly":
        return <AnomalyDetection />;
      case "resolution":
        return <IncidentResolution />;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage("login")} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (currentPage === "landing" || currentPage === "login") {
    return <div className="min-h-screen">{renderPage()}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar */}
      <nav
        className={`bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-30 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">SafeTour</span>
              </div>
            </div>
            {/* Right */}
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {user?.role === "tourist" ? "Tourist" : "Authority"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUser(null);
                  setToken(null);
                  localStorage.removeItem("token");
                  setCurrentPage("landing");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg 
            transform transition-transform duration-300 ease-in-out 
            lg:translate-x-0 lg:static lg:inset-0 z-40
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                {getCurrentPages().map((page) => {
                  const Icon = page.icon;

                  // Special case for Digital ID → link out to localhost:3001
                  if (page.id === "digitalid") {
                    return (
                      <a
                        key={page.id}
                        href="http://localhost:3001/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center px-3 py-2 rounded-md text-md hover:bg-gray-100"
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {page.label}
                      </a>
                    );
                  }

                  return (
                    <Button
                      key={page.id}
                      variant={currentPage === page.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-md"
                      onClick={() => {
                        setCurrentPage(page.id as Page);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {page.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64">{renderPage()}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}