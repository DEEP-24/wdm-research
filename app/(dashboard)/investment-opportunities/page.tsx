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
import { CalendarIcon, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  sector: string[];
  companyName: string;
  riskLevel: "Low" | "Medium" | "High";
}

interface Investment {
  opportunityId: string;
  amount: number;
  date: string;
}

export default function InvestmentOpportunities() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    const mockOpportunities: InvestmentOpportunity[] = [
      {
        id: "1",
        title: "Green Energy Startup",
        description: "Innovative solar panel technology for residential use.",
        targetAmount: 1000000,
        currentAmount: 750000,
        deadline: "2024-09-30",
        sector: ["Renewable Energy", "Technology"],
        companyName: "SolarTech Innovations",
        riskLevel: "Medium",
      },
      {
        id: "2",
        title: "AI-Powered Healthcare Solution",
        description: "Machine learning platform for early disease detection.",
        targetAmount: 2000000,
        currentAmount: 1200000,
        deadline: "2024-08-15",
        sector: ["Healthcare", "Artificial Intelligence"],
        companyName: "MedAI Systems",
        riskLevel: "High",
      },
      {
        id: "3",
        title: "Sustainable Agriculture Project",
        description: "Vertical farming solution for urban areas.",
        targetAmount: 500000,
        currentAmount: 300000,
        deadline: "2024-07-31",
        sector: ["Agriculture", "Sustainability"],
        companyName: "UrbanCrop Solutions",
        riskLevel: "Low",
      },
    ];

    const storedOpportunities = localStorage.getItem("investmentOpportunities");
    if (storedOpportunities) {
      setOpportunities(JSON.parse(storedOpportunities));
    } else {
      setOpportunities(mockOpportunities);
      localStorage.setItem("investmentOpportunities", JSON.stringify(mockOpportunities));
    }

    // Load user investments from localStorage
    const storedInvestments = localStorage.getItem("userInvestments");
    if (storedInvestments) {
      setUserInvestments(JSON.parse(storedInvestments));
    }
  }, []);

  const handleInvest = (opportunityId: string, amount: number) => {
    const updatedOpportunities = opportunities.map((opp) => {
      if (opp.id === opportunityId) {
        return { ...opp, currentAmount: opp.currentAmount + amount };
      }
      return opp;
    });
    setOpportunities(updatedOpportunities);
    localStorage.setItem("investmentOpportunities", JSON.stringify(updatedOpportunities));

    // Save the new investment
    const newInvestment: Investment = {
      opportunityId,
      amount,
      date: new Date().toISOString(),
    };
    const updatedInvestments = [...userInvestments, newInvestment];
    setUserInvestments(updatedInvestments);
    localStorage.setItem("userInvestments", JSON.stringify(updatedInvestments));

    toast.success(
      `Successfully invested $${amount.toLocaleString()} in ${selectedOpportunity?.title}`,
    );
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Investment Opportunities</h1>

      <ScrollArea className="h-[calc(100vh-300px)]">
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
                    Target: ${opportunity.targetAmount.toLocaleString()}
                  </p>
                  <p className="text-green-600">
                    Current: ${opportunity.currentAmount.toLocaleString()}
                  </p>
                  <p className="flex items-center text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sectors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.sector.map((s, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Badge key={index} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{opportunity.companyName}</p>
                  <p className="text-sm">
                    Risk Level:{" "}
                    <span
                      className={`font-bold ${
                        opportunity.riskLevel === "Low"
                          ? "text-green-600"
                          : opportunity.riskLevel === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {opportunity.riskLevel}
                    </span>
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
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invest in {selectedOpportunity?.title}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const amount = Number(formData.get("amount"));
                        if (amount > 0) {
                          handleInvest(selectedOpportunity!.id, amount);
                        }
                      }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Investment Amount ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              id="amount"
                              name="amount"
                              type="number"
                              min="1"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Button type="submit">Confirm Investment</Button>
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
