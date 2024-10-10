"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get existing users or initialize with test user
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (!existingUsers.some((user) => user.id === testUser.id)) {
      existingUsers.push(testUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
    }

    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/login"); // Assuming you have a login page
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            Welcome, {currentUser?.firstName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>Research Interests:</strong> {currentUser?.researchInterests}
            </p>
            <p>
              <strong>Expertise:</strong> {currentUser?.expertise}
            </p>
            <p>
              <strong>Role:</strong> {currentUser?.role}
            </p>
            <p>
              <strong>Phone:</strong> {currentUser?.phoneNo}
            </p>
            <p>
              <strong>Address:</strong> {currentUser?.address}
            </p>
            <p>
              <strong>Date of Birth:</strong> {currentUser?.dob}
            </p>
          </div>
          <div className="mt-6 text-center">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
