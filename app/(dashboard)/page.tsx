"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RotateCwIcon, SendIcon } from "lucide-react";
import type { User } from "@/types/user";

const requestData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
  { name: "Jun", value: 239 },
];

const budgetData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 100 },
];

const COLORS = ["#1E40AF", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

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

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Store the test user in localStorage if it doesn't exist
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (!existingUsers.some((user) => user.id === testUser.id)) {
      existingUsers.push(testUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
    }

    // Check for current user
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#BFDBFE" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">
              Budget Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-blue-700">Quick Chat</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            >
              <RotateCwIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  👋
                </div>
                <div className="bg-blue-50 rounded-lg p-2 max-w-[80%]">
                  <p className="text-blue-800">
                    Hi {currentUser.firstName}! How can I assist you today?
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 relative">
              <Input className="pr-10" placeholder="Type your message..." />
              <Button className="absolute right-0 top-0 h-full" size="icon">
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
