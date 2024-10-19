"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PhoneIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  topics: string[];
  contactEmail: string;
  organizationName: string;
  phoneNumber: string;
}

interface Application {
  opportunityId: string;
  name: string;
  email: string;
  proposal: string;
  links: string[];
}

export default function FundingOpportunities() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const mockOpportunities: FundingOpportunity[] = [
      {
        id: "1",
        title: "Green Energy Innovation Fund",
        description: "Supporting projects that advance renewable energy technologies.",
        amount: 500000,
        deadline: "2024-06-30",
        topics: ["Solar energy", "Wind power", "Energy storage", "Smart grids"],
        contactEmail: "greenfund@example.com",
        organizationName: "EcoTech Foundation",
        phoneNumber: "+1 (555) 123-4567",
      },
      {
        id: "2",
        title: "AI for Social Good Grant",
        description: "Funding AI projects that address pressing social issues.",
        amount: 250000,
        deadline: "2024-08-15",
        topics: ["Artificial Intelligence", "Machine Learning", "Social Impact", "Ethics in AI"],
        contactEmail: "ai4good@example.com",
        organizationName: "TechForward Institute",
        phoneNumber: "+1 (555) 987-6543",
      },
      {
        id: "3",
        title: "Ocean Conservation Research Grant",
        description: "Supporting marine biology and ocean preservation initiatives.",
        amount: 350000,
        deadline: "2024-07-31",
        topics: [
          "Marine Biology",
          "Ocean Cleanup",
          "Coral Reef Restoration",
          "Sustainable Fishing",
        ],
        contactEmail: "blueocean@example.com",
        organizationName: "OceanLife Foundation",
        phoneNumber: "+1 (555) 456-7890",
      },
      // Add more mock opportunities as needed
    ];

    const storedOpportunities = localStorage.getItem("fundingOpportunities");
    if (storedOpportunities) {
      setOpportunities(JSON.parse(storedOpportunities));
    } else {
      setOpportunities(mockOpportunities);
      localStorage.setItem("fundingOpportunities", JSON.stringify(mockOpportunities));
    }
  }, []);

  const handleApply = (application: Application) => {
    const storedApplications = localStorage.getItem("applications") || "[]";
    const applications = JSON.parse(storedApplications);
    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));
    toast.success("Application Submitted");
    setIsDialogOpen(false);
    setLinks([]);
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Funding Opportunities</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-700">
                  {opportunity.title}
                </CardTitle>
                <p className="text-gray-600">{opportunity.description}</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-lg">
                    Amount: ${opportunity.amount.toLocaleString()}
                  </p>
                  <p className="flex items-center text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Topics of Interest:</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.topics.map((topic, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Contact Information:</h4>
                  <p className="text-sm">{opportunity.organizationName}</p>
                  <p className="text-sm text-blue-600">{opportunity.contactEmail}</p>
                  <p className="text-sm flex items-center">
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    {opportunity.phoneNumber}
                  </p>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedOpportunity(opportunity);
                        setIsDialogOpen(true);
                      }}
                    >
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {selectedOpportunity?.title}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleApply({
                          opportunityId: selectedOpportunity!.id,
                          name: formData.get("name") as string,
                          email: formData.get("email") as string,
                          proposal: formData.get("proposal") as string,
                          links: links.filter((link) => link.trim() !== ""),
                        });
                      }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div>
                          <Label htmlFor="proposal">Proposal</Label>
                          <Textarea id="proposal" name="proposal" required />
                        </div>
                        <div>
                          <Label>Links</Label>
                          {links.map((link, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <div key={index} className="flex items-center mt-2">
                              <Input
                                value={link}
                                onChange={(e) => updateLink(index, e.target.value)}
                                placeholder="https://example.com"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newLinks = links.filter((_, i) => i !== index);
                                  setLinks(newLinks);
                                }}
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addLink}
                            className="mt-2"
                          >
                            Add Link
                          </Button>
                        </div>
                        <Button type="submit">Submit Application</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
