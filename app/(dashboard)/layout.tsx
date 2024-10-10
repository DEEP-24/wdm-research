"use client";

import PageHeading from "@/app/(dashboard)/_components/page-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/user";
import {
  BellIcon,
  BriefcaseIcon,
  CalendarCheck2Icon,
  CalendarIcon,
  ChevronDownIcon,
  DollarSignIcon,
  FileTextIcon,
  HomeIcon,
  MenuIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarItems = [
  { icon: HomeIcon, label: "Dashboard", href: "/" },
  { icon: CalendarIcon, label: "Events", href: "/events" },
  { icon: CalendarCheck2Icon, label: "Reservations", href: "/reservations" },
  { icon: DollarSignIcon, label: "Fundings", href: "/fundings" },
  { icon: FileTextIcon, label: "Grant Applications", href: "/grants" },
  { icon: MessageSquareIcon, label: "Discussions", href: "/discussions" },
  { icon: UserIcon, label: "Profile", href: "/profile" },
  { icon: BriefcaseIcon, label: "Projects", href: "/projects" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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
    router.push("/login");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">ResearchSphere</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-blue-600 hover:text-white ${
                    pathname === item.href ? "bg-blue-600" : ""
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-blue-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="lg:hidden mr-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <Input
                className="pl-10 w-64 bg-blue-50 border-blue-300 focus:border-blue-500"
                type="search"
                placeholder="Search"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            >
              <BellIcon className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={currentUser.firstName}
                    />
                    <AvatarFallback className="bg-blue-200 text-blue-700">
                      {currentUser.firstName[0]}
                      {currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-blue-700">
                    {currentUser.firstName}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-blue-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
