import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Shield } from "lucide-react";
import type { AppUser } from "../App";
import { login, register } from "../api";

interface LoginProps {
  onLoginSuccess: (user: AppUser, token: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState<{
  name: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  role: "tourist" | "admin";
  idProofType: "Aadhaar" | "Passport" | "License";
  idProofNumber: string;
}>({
  name: "",
  email: "",
  phone: "",
  password: "",
  location: "",
  role: "tourist",
  idProofType: "Aadhaar",
  idProofNumber: "",
});


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res: any; // AuthResponse from API

      if (isSignup) {
        res = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          location: form.location,
          role: form.role,
          idProof: {
            type: form.idProofType,
            number: form.idProofNumber,
          },
        });
      } else {
        res = await login({
          email: form.email,
          password: form.password,
        });
      }

      // ✅ Store only the token
      localStorage.setItem("token", res.token);

      // ✅ Call success handler with user object
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      console.error(isSignup ? "Signup failed:" : "Login failed:", err.message);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  value={form.location}
                  onChange={handleChange}
                />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-700"
                >
                  <option value="tourist">Tourist</option>
                  <option value="admin">Admin</option>
                </select>

                <label className="block text-sm text-gray-600">
                  Select ID Proof Type
                </label>
                <select
                  name="idProofType"
                  value={form.idProofType}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-700"
                >
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="Passport">Passport</option>
                  <option value="License">Driving License</option>
                </select>

                <Input
                  type="text"
                  name="idProofNumber"
                  placeholder="Enter ID Number"
                  value={form.idProofNumber}
                  onChange={handleChange}
                />
              </>
            )}

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:underline text-sm"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don’t have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
