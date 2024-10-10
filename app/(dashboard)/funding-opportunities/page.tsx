"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface GrantApplication {
  opportunity_id: number;
  project_id: string;
  project_title: string;
  project_description: string;
  request_amount: number;
  keywords: string;
  status: "submitted" | "under review" | "accepted" | "rejected";
  reviewedBy?: string;
}

export default function FundingOpportunities() {
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const storedApplications = localStorage.getItem("grantApplications");
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }

    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
  }, []);

  const updateApplicationStatus = (projectId: string, newStatus: "accepted" | "rejected") => {
    const updatedApplications = applications.map((app) =>
      app.project_id === projectId
        ? { ...app, status: newStatus, reviewedBy: currentUser || undefined }
        : app,
    );
    setApplications(updatedApplications);
    localStorage.setItem("grantApplications", JSON.stringify(updatedApplications));
  };

  const filteredApplications = applications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.project_title.toLowerCase().includes(searchTermLower) ||
      app.project_description.toLowerCase().includes(searchTermLower) ||
      app.keywords.toLowerCase().includes(searchTermLower) ||
      app.status.toLowerCase().includes(searchTermLower) ||
      app.request_amount.toString().includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10 w-full"
          type="search"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {filteredApplications.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl text-gray-500">No grant applications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApplications.map((application) => (
              <Card
                key={application.project_id}
                className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-blue-700 line-clamp-2">
                      {application.project_title}
                    </CardTitle>
                    <Badge
                      variant={
                        application.status === "accepted"
                          ? "default"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className="ml-2 shrink-0"
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                    {application.project_description}
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold">${application.request_amount.toLocaleString()}</p>
                    <p className="text-gray-500 line-clamp-1">{application.keywords}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {application.status === "submitted" && currentUser ? (
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 text-xs"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.project_id, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        className="flex-1 text-xs"
                        size="sm"
                        variant="destructive"
                        onClick={() => updateApplicationStatus(application.project_id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full text-xs" size="sm" disabled>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
