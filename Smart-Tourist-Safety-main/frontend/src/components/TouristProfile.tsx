import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, MapPin, User as UserIcon, Shield, Phone, FileText } from "lucide-react";
import type { AppUser } from "../App";

interface TouristProfileProps {
  user: AppUser;
}

export function TouristProfile({ user }: TouristProfileProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tourist Profile</h1>
        <p className="text-gray-600">
          Manage your personal details and identification securely.
        </p>
      </div>

      {/* Profile Details */}
      <Card className="shadow-md border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Name */}
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-lg font-medium text-gray-900">
              {user.name || "Not provided"}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-lg text-gray-700">
              {user.email || "Not provided"}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-lg text-gray-700">
              {user.location || "Not specified"}
            </span>
          </div>

          {/* Role */}
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-lg text-gray-700 capitalize">
              {user.role || "Unknown"}
            </span>
          </div>

          {/* Extra (Optional ID / Contact) */}
          {user.phone && (
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-lg text-gray-700">{user.phone}</span>
            </div>
          )}
          {user.idProof && (
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-lg text-gray-700">
                {user.idProof.type}: {user.idProof.number}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
