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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    researchInterests: "",
    expertise: "",
    role: "",
    phoneNo: "",
    address: "",
    dob: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Get existing users or initialize empty array
      const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if a user with the same email already exists
      const emailExists = existingUsers.some((user) => user.email === formData.email);
      if (emailExists) {
        toast.error("A user with this email already exists");
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        researchInterests: formData.researchInterests,
        expertise: formData.expertise,
        role: formData.role,
        phoneNo: formData.phoneNo,
        address: formData.address,
        dob: formData.dob,
      };

      existingUsers.push(newUser);

      // Save updated users array
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      toast.success("Registration successful!");
      // Redirect to home page or dashboard
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-4xl bg-gradient-to-br from-blue-50 to-indigo-100 backdrop-blur-sm shadow-lg border border-blue-200">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-xs sm:text-sm lg:text-base text-blue-700">
            Start your journey in collaborative research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs sm:text-sm font-medium text-blue-800">
                First Name
              </Label>
              <Input
                id="firstName"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs sm:text-sm font-medium text-blue-800">
                Last Name
              </Label>
              <Input
                id="lastName"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-blue-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNo" className="text-xs sm:text-sm font-medium text-blue-800">
                Phone Number
              </Label>
              <Input
                id="phoneNo"
                type="tel"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.phoneNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-blue-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs sm:text-sm font-medium text-blue-800"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="researchInterests"
                className="text-xs sm:text-sm font-medium text-blue-800"
              >
                Research Interests
              </Label>
              <Input
                id="researchInterests"
                placeholder="e.g., AI, Climate Science, Neurobiology"
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.researchInterests}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise" className="text-xs sm:text-sm font-medium text-blue-800">
                Expertise
              </Label>
              <Input
                id="expertise"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.expertise}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs sm:text-sm font-medium text-blue-800">
                Role
              </Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-xs sm:text-sm font-medium text-blue-800">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                required
                className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs sm:text-sm font-medium text-blue-800">
              Address
            </Label>
            <Input
              id="address"
              required
              className="bg-white/70 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
        <CardFooter className="p-4 sm:p-6">
          <div className="text-xs sm:text-sm text-center w-full text-blue-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-indigo-600 font-semibold transition-colors"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
