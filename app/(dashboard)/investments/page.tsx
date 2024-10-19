"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface Investment {
  opportunityId: string;
  amount: number;
  date: string;
}

interface InvestmentOpportunity {
  id: string;
  title: string;
  companyName: string;
  riskLevel: "Low" | "Medium" | "High";
}

export default function InvestmentsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== "investor") {
        router.push("/");
      } else {
        setCurrentUser(user);

        // Fetch user investments from localStorage
        const storedInvestments = localStorage.getItem("userInvestments");
        if (storedInvestments) {
          setInvestments(JSON.parse(storedInvestments));
        }

        // Fetch investment opportunities from localStorage
        const storedOpportunities = localStorage.getItem("investmentOpportunities");
        if (storedOpportunities) {
          setOpportunities(JSON.parse(storedOpportunities));
        }
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!currentUser) {
    return null;
  }

  const totalInvestment = investments.reduce((sum, investment) => sum + investment.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">My Investments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalInvestment.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{investments.length}</p>
          </CardContent>
        </Card>
      </div>

      {investments.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <p className="text-xl text-center text-gray-600">
              You haven't made any investments yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">Investment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-3 whitespace-nowrap">Project Name</th>
                      <th className="p-3 whitespace-nowrap">Company</th>
                      <th className="p-3 whitespace-nowrap">Amount</th>
                      <th className="p-3 whitespace-nowrap">Date</th>
                      <th className="p-3 whitespace-nowrap">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment, index) => {
                      const opportunity = opportunities.find(
                        (opp) => opp.id === investment.opportunityId,
                      );
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <tr key={index} className="border-b border-blue-100">
                          <td className="p-3 whitespace-nowrap">
                            {opportunity?.title || "Unknown"}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {opportunity?.companyName || "Unknown"}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            ${investment.amount.toLocaleString()}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {new Date(investment.date).toLocaleDateString()}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={cn(
                                "font-bold",
                                opportunity?.riskLevel === "Low" && "text-green-600",
                                opportunity?.riskLevel === "Medium" && "text-yellow-600",
                                opportunity?.riskLevel === "High" && "text-red-600",
                              )}
                            >
                              {opportunity?.riskLevel || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Button onClick={() => router.push("/investment-opportunities")}>
          Explore More Opportunities
        </Button>
      </div>
    </div>
  );
}
