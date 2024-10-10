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

const testUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "admin@app.com",
    password: "password",
    researchInterests: "Artificial Intelligence, Machine Learning",
    expertise: "Computer Science",
    role: "admin",
    phoneNo: "+1234567890",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    dob: "1985-01-01",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "user@app.com",
    password: "password",
    researchInterests: "Biotechnology, Genetics",
    expertise: "Biology",
    role: "user",
    phoneNo: "+1987654321",
    address: "456 Science Ave, Boston, MA 02108",
    dob: "1990-05-15",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "investor@app.com",
    password: "password",
    researchInterests: "Renewable Energy, Sustainability",
    expertise: "Environmental Science",
    role: "investor",
    phoneNo: "+1122334455",
    address: "789 Green St, San Francisco, CA 94111",
    dob: "1980-11-30",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Williams",
    email: "organizer@app.com",
    password: "password",
    researchInterests: "Nanotechnology, Materials Science",
    expertise: "Engineering",
    role: "organizer",
    phoneNo: "+1567890123",
    address: "321 Nano Blvd, Austin, TX 78701",
    dob: "1988-07-22",
  },
];

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the test users already exist in localStorage
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const newUsers = testUsers.filter(
      (testUser) => !existingUsers.some((user) => user.id === testUser.id),
    );

    if (newUsers.length > 0) {
      // Add new test users if they don't exist
      localStorage.setItem("users", JSON.stringify([...existingUsers, ...newUsers]));
    }

    // Check if there's a current user and redirect if found
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      router.push("/");
    }
  }, [router]);

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
          {testUsers.map((user) => (
            <div key={user.id} className="mt-2">
              <p className="text-sm text-blue-700">
                <strong>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}:</strong>{" "}
                {user.email} / password
              </p>
            </div>
          ))}
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
