"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";
import {
  ArrowRightIcon,
  BadgeDollarSignIcon,
  BriefcaseIcon,
  CalendarIcon,
  FileIcon,
  FileTextIcon,
  MessageCircleIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  {
    title: "File Sharing",
    description: "Upload and share research documents securely.",
    icon: FileIcon,
    href: "/file-sharing",
  },
  {
    title: "Forums",
    description: "Engage in discussions with researchers worldwide.",
    icon: MessageCircleIcon,
    href: "/forums",
  },
  {
    title: "Event Management",
    description: "View upcoming events and manage your reservations.",
    icon: CalendarIcon,
    href: "/events",
  },
  {
    title: "Funding Opportunities",
    description: "Explore and apply for various funding options.",
    icon: BadgeDollarSignIcon,
    href: "/funding-opportunities",
  },
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

const projects = [
  { name: "Quantum Computing Research", link: "https://research.ibm.com/quantum-computing" },
  { name: "AI Ethics Study", link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10097940" },
  { name: "Climate Change Impact Analysis", link: "https://www.epa.gov/cira" },
];

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
          href="/researchers"
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

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feature, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  Learn more
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <QuickLinkButton href="/events" icon={CalendarIcon} label="Upcoming Events" />
              <QuickLinkButton href="/reservations" icon={FileTextIcon} label="My Reservations" />
              <QuickLinkButton href="/projects" icon={BriefcaseIcon} label="Research Projects" />
              <QuickLinkButton href="/profile" icon={UsersIcon} label="User Profile" />
            </div>
          </CardContent>
        </Card>
      </div>

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
            {projects.map((project, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={index} className="flex justify-between items-center">
                <span>{project.name}</span>
                <Link href={project.link} passHref target="_blank">
                  <Button variant="ghost" size="sm">
                    View <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

interface QuickLinkButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function QuickLinkButton({ href, icon: Icon, label }: QuickLinkButtonProps) {
  return (
    <Link href={href}>
      <Button variant="outline" className="flex items-center gap-2 px-4 py-2 h-auto">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  );
}

function renderInvestorDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {[
          {
            title: "Investment Opportunities",
            description: "Explore new and exciting investment opportunities in research projects.",
            href: "/investment-opportunities",
            buttonText: "View Opportunities",
          },
          {
            title: "My Investments",
            description: "Track and manage your current investments in ongoing research projects.",
            href: "/investments",
            buttonText: "View My Investments",
          },
        ].map((card, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Card key={index}>
            <CardHeader className="border-b p-6">
              <CardTitle className="text-2xl font-semibold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">{card.description}</p>
              <Link href={card.href} className="block">
                <Button className="w-full bg-black border-2 border-gray-900 text-white hover:bg-gray-900 transition-colors duration-300">
                  {card.buttonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader className="border-b p-6">
          <CardTitle className="text-2xl font-semibold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.investor.map((link, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Link key={index} href={link.href} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-50 transition-colors duration-300 border-gray-200"
                >
                  <link.icon className="mr-3 h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{link.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
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
