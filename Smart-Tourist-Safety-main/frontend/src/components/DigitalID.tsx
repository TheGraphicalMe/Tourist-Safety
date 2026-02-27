import React from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface DigitalIDProps {
  name: string;
  role: string;
  idProof?: {
    type: string;
    number: string;
  };
}

export const DigitalID: React.FC<DigitalIDProps> = ({ name, role, idProof }) => {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-[350px] shadow-lg border border-gray-300 rounded-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold text-center">Digital ID</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <p className="text-lg font-medium">{name}</p>
          <Badge variant="outline">
            {role === "tourist" ? "Tourist" : "Authority"}
          </Badge>
          {idProof ? (
            <div className="mt-2 text-center text-sm text-gray-600">
              <p>{idProof.type}:</p>
              <p className="font-mono">{idProof.number}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ID proof uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};