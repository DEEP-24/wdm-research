"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@/types/user";

const testUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "testuser@app.com",
  password: "password",
  researchInterests: "Artificial Intelligence, Machine Learning",
  expertise: "Computer Science",
  role: "Research Scientist",
  phoneNo: "+1234567890",
  address: "123 Tech Street, Silicon Valley, CA 94000",
  dob: "1985-01-01",
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Always add or update the test user in localStorage
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = existingUsers.filter((user) => user.id !== testUser.id);
    updatedUsers.push(testUser);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fetch users from localStorage
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg border border-blue-200 max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-blue-600">Welcome Back</CardTitle>
        <CardDescription className="text-center text-blue-700">
          Sign in to your account to continue your research journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-blue-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-blue-800">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md transition-all shadow-md hover:shadow-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 p-3 bg-blue-100 rounded-md">
          <p className="text-sm text-blue-800 font-medium">Test User Credentials:</p>
          <p className="text-sm text-blue-700">Email: testuser@app.com</p>
          <p className="text-sm text-blue-700">Password: password</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-blue-700">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-indigo-600 font-semibold transition-colors"
          >
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
