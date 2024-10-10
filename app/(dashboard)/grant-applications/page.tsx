"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface GrantApplication {
  opportunity_id: number;
  project_id: string;
  project_title: string;
  project_description: string;
  request_amount: number;
  keywords: string;
  status: "submitted" | "under review" | "rejected" | "accepted";
  reviewed_by?: {
    firstName: string;
    lastName: string;
  };
}

export default function GrantApplications() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [application, setApplication] = useState<GrantApplication>({
    opportunity_id: 0,
    project_id: "",
    project_title: "",
    project_description: "",
    request_amount: 0,
    keywords: "",
    status: "submitted", // Default status for new applications
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem("projectProposals");
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      const convertedProjects: Project[] = parsedProjects.map((proposal: any) => ({
        id: proposal.id.toString(),
        title: proposal.title,
        description: proposal.description,
      }));
      setProjects(convertedProjects);
    }

    const storedApplications = localStorage.getItem("grantApplications");
    if (storedApplications) {
      const parsedApplications = JSON.parse(storedApplications);
      // Ensure all applications have a valid status and parse reviewedBy
      const validatedApplications = parsedApplications.map((app: any) => ({
        ...app,
        status: validateStatus(app.status),
        reviewed_by: app.reviewedBy ? JSON.parse(app.reviewedBy) : undefined,
      }));
      setApplications(validatedApplications);
    }
  }, []);

  // Add this function to validate and sanitize the status
  const validateStatus = (status: string): GrantApplication["status"] => {
    const validStatuses: GrantApplication["status"][] = [
      "submitted",
      "under review",
      "rejected",
      "accepted",
    ];
    return validStatuses.includes(status as GrantApplication["status"])
      ? (status as GrantApplication["status"])
      : "submitted";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects.find((project) => project.id === projectId);
    if (selectedProject) {
      setApplication((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        project_title: selectedProject.title,
        project_description: selectedProject.description,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApplication = { ...application, status: "submitted" };
    const newApplications = [...applications, { ...newApplication, status: "submitted" as const }];
    setApplications(newApplications);
    localStorage.setItem("grantApplications", JSON.stringify(newApplications));
    console.log("Submitting application:", newApplication);
    setApplication({
      opportunity_id: 0,
      project_id: "",
      project_title: "",
      project_description: "",
      request_amount: 0,
      keywords: "",
      status: "submitted",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Application</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Grant Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="opportunity_id">Opportunity ID</Label>
                <Input
                  id="opportunity_id"
                  name="opportunity_id"
                  type="number"
                  value={application.opportunity_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="project_select">Select Project</Label>
                <Select onValueChange={handleProjectSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project_title">Project Title</Label>
                <Input
                  id="project_title"
                  name="project_title"
                  value={application.project_title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="project_description">Project Description</Label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  value={application.project_description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="request_amount">Requested Amount ($)</Label>
                <Input
                  id="request_amount"
                  name="request_amount"
                  type="number"
                  value={application.request_amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={application.keywords}
                  onChange={handleInputChange}
                  placeholder="e.g., sustainability, innovation, technology"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-700">
              Application Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Eligibility Criteria:</strong> Carefully review the eligibility
                    requirements for each grant opportunity. Ensure your organization and project
                    meet all specified criteria before applying.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Project Alignment:</strong> Clearly demonstrate how your project aligns
                    with the funding opportunity's goals and priorities. Use specific examples and
                    data to support your claims.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Budget Preparation:</strong> Develop a detailed, realistic budget that
                    accurately reflects your project's needs. Be prepared to justify each expense
                    and show how it contributes to your project's success.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Proposal Writing Tips:</strong> Write a clear, concise, and compelling
                    project description. Use simple language, avoid jargon, and focus on the problem
                    you're addressing and your proposed solution.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Supporting Documents:</strong> Gather all necessary supporting
                    documents, such as financial statements, tax records, and letters of support.
                    Ensure they are up-to-date and properly formatted.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Review Process:</strong> Have colleagues or mentors review your
                    application before submission. Fresh eyes can catch errors and provide valuable
                    feedback on clarity and persuasiveness.
                  </div>
                </li>
                <li className="flex items-start">
                  <InfoIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Submission Deadlines:</strong> Note all deadlines and submit your
                    application well in advance. Late submissions are often automatically
                    disqualified, regardless of merit.
                  </div>
                </li>
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-700">
              Your Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No applications filled yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map((app, index) => (
                    <Card
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardTitle className="text-lg font-bold truncate">
                          {app.project_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Opportunity ID:
                            </span>
                            <span className="text-sm font-semibold">{app.opportunity_id}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Requested Amount:
                            </span>
                            <span className="text-sm font-semibold">
                              ${app.request_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Status:</span>
                            <Badge
                              variant={
                                app.status === "accepted"
                                  ? "secondary"
                                  : app.status === "rejected"
                                    ? "destructive"
                                    : "default"
                              }
                              className="capitalize"
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {app.reviewed_by && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Reviewed by:
                              </span>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${app.reviewed_by.firstName} ${app.reviewed_by.lastName}`}
                                  />
                                  <AvatarFallback>
                                    {`${app.reviewed_by.firstName[0]}${app.reviewed_by.lastName[0]}`}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold">{`${app.reviewed_by.firstName} ${app.reviewed_by.lastName}`}</span>
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-1">
                              Keywords:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {app.keywords.split(",").map((keyword, i) => (
                                <Badge
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  key={i}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800"
                                >
                                  {keyword.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
