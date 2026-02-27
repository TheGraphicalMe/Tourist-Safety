// frontend/src/api.ts
const API_URL = "http://localhost:5000/api"; // change if deployed

// Helper for requests
const request = async (
  url: string,
  method: string,
  data?: any,
  token?: string
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "API request failed");
  }

  return res.json();
};

//
// 🔹 AUTH
//
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  role?: "tourist" | "admin";
  idProof?: {
    type: "Aadhaar" | "Passport" | "License";
    number: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: "tourist" | "admin";
  idProof?: {
    type: "Aadhaar" | "Passport" | "License";
    number: string;
  };
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ✅ Properly typed functions
export const register = (data: RegisterData): Promise<AuthResponse> =>
  request("/auth/register", "POST", data) as Promise<AuthResponse>;

export const login = (data: { email: string; password: string }): Promise<AuthResponse> =>
  request("/auth/login", "POST", data) as Promise<AuthResponse>;

export const getMe = (token: string) =>
  request("/auth/me", "GET", undefined, token);

//
// 🔹 PROFILE
//
export const getProfile = (token: string) =>
  request("/profile", "GET", undefined, token);

export const updateProfile = (data: any, token: string) =>
  request("/profile", "PUT", data, token);

//
// 🔹 TRIPS
//

export const createTrip = (data: any, token: string) =>
  request("/trip/create", "POST", data, token); // note /trip/create

export const getTrips = (token: string) =>
  request("/trip", "GET", undefined, token); // note /trip

export const getTripById = (id: string, token: string) =>
  request(`/trip/${id}`, "GET", undefined, token);

export const updateTrip = (id: string, data: any, token: string) =>
  request(`/trip/${id}`, "PUT", data, token);

export const deleteTrip = (id: string, token: string) =>
  request(`/trip/${id}`, "DELETE", undefined, token);


//
// 🔹 INCIDENTS
//
export const createIncident = (data: any, token: string) =>
  request("/incidents", "POST", data, token);

export const getIncidents = (token: string) =>
  request("/incidents", "GET", undefined, token);

export const getIncidentById = (id: string, token: string) =>
  request(`/incidents/${id}`, "GET", undefined, token);

export const updateIncident = (id: string, data: any, token: string) =>
  request(`/incidents/${id}`, "PUT", data, token);

export const deleteIncident = (id: string, token: string) =>
  request(`/incidents/${id}`, "DELETE", undefined, token);

//
// 🔹 ADMIN (example - needs backend support)
//
export const getAllUsers = (token: string) =>
  request("/users", "GET", undefined, token);

//
// 🔹 ANOMALY DETECTION (AI) (placeholder)
//
export const detectAnomaly = (data: any, token: string) =>
  request("/anomaly/detect", "POST", data, token);

//
// 🔹 ALERTS (placeholder)
//
export const searchAlerts = (query: string, token: string) =>
  request(`/alerts?search=${encodeURIComponent(query)}`, "GET", undefined, token);
