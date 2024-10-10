"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  BadgeDollarSignIcon,
} from "lucide-react";
import type { User } from "@/types/user";

const activityData = [
  { name: "Mon", value: 10 },
  { name: "Tue", value: 15 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 12 },
  { name: "Fri", value: 20 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 3 },
];

const platformFeatures = [
  { title: "Event Management", description: "Organize and manage research events effortlessly." },
  { title: "Funding Opportunities", description: "Explore and apply for various funding options." },
  {
    title: "Collaboration Tools",
    description: "Connect and collaborate with researchers worldwide.",
  },
  { title: "Resource Sharing", description: "Share and access valuable research resources." },
];

const latestNews = [
  { title: "New Quantum Computing Grant Announced", date: "2023-06-15" },
  { title: "ResearchSphere Reaches 1 Million Users", date: "2023-06-10" },
  { title: "AI Ethics Symposium: Registration Open", date: "2023-06-05" },
];

const quickLinks = {
  adminUser: [
    { title: "Upcoming Events", href: "/events", icon: CalendarIcon },
    { title: "My Reservations", href: "/reservations", icon: FileTextIcon },
    { title: "Research Projects", href: "/projects", icon: BriefcaseIcon },
    { title: "User Profile", href: "/profile", icon: UsersIcon },
  ],
  investor: [
    { title: "Funding Opportunities", href: "/funding-opportunities", icon: BadgeDollarSignIcon },
    { title: "My Investments", href: "/", icon: BriefcaseIcon },
    { title: "User Profile", href: "/profile", icon: UsersIcon },
  ],
  organizer: [
    { title: "Manage Events", href: "/events", icon: CalendarIcon },
    { title: "Reservations", href: "/reservations", icon: FileTextIcon },
    { title: "User Profile", href: "/profile", icon: UsersIcon },
  ],
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  const renderDashboardContent = () => {
    switch (currentUser.role) {
      case "admin":
      case "user":
        return renderAdminUserDashboard();
      case "investor":
        return renderInvestorDashboard();
      case "organizer":
        return renderOrganizerDashboard();
      default:
        return renderAdminUserDashboard();
    }
  };

  return <div className="container mx-auto px-4 py-3">{renderDashboardContent()}</div>;
}

function renderAdminUserDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link
          href="/chat"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <p className="text-gray-600">Connect with other researchers in real-time.</p>
        </Link>
        <Link
          href="/file-sharing"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">File Sharing</h2>
          <p className="text-gray-600">Upload and share documents with your peers.</p>
        </Link>
        <Link
          href="/forums"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Discussion Forums</h2>
          <p className="text-gray-600">Participate in topic-based discussions.</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {platformFeatures.map((feature, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <li key={index}>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Latest News & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {latestNews.map((news, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <li key={index} className="flex justify-between items-center">
                  <span>{news.title}</span>
                  <span className="text-sm text-gray-500">{news.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.adminUser.map((link, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Link key={index} href={link.href}>
                <Button variant="outline" className="w-full justify-start">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Popular Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span>Quantum Computing Research</span>
              <Button variant="ghost" size="sm">
                View <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </li>
            <li className="flex justify-between items-center">
              <span>AI Ethics Study</span>
              <Button variant="ghost" size="sm">
                View <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </li>
            <li className="flex justify-between items-center">
              <span>Climate Change Impact Analysis</span>
              <Button variant="ghost" size="sm">
                View <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

function renderInvestorDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Investor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Quantum Computing Startup</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>AI-driven Drug Discovery</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Sustainable Energy Project</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>My Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Nanotech Research Lab</span>
                <span className="text-green-600">+12.5%</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Biotech Incubator</span>
                <span className="text-red-600">-3.2%</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Space Exploration Venture</span>
                <span className="text-green-600">+8.7%</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.investor.map((link, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Link key={index} href={link.href}>
                <Button variant="outline" className="w-full justify-start">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function renderOrganizerDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Organizer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>AI Symposium</span>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Biotech Conference</span>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Climate Change Workshop</span>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Venue Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Main Auditorium</span>
                <span className="text-green-600">Confirmed</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Conference Room A</span>
                <span className="text-yellow-600">Pending</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Exhibition Hall</span>
                <span className="text-green-600">Confirmed</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.organizer.map((link, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Link key={index} href={link.href}>
                <Button variant="outline" className="w-full justify-start">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
