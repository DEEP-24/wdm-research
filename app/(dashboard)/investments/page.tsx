"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

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

export default function InvestmentsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<GrantApplication[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== "investor") {
        router.push("/");
      } else {
        setCurrentUser(user);

        // Fetch grant applications from localStorage
        const grantApplicationsString = localStorage.getItem("grantApplications");
        if (grantApplicationsString) {
          const allApplications: GrantApplication[] = JSON.parse(grantApplicationsString);
          const userInvestments = allApplications.filter(
            (app) => app.reviewedBy === user.id && app.status === "accepted",
          );
          setInvestments(userInvestments);
        }
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!currentUser) {
    return null;
  }

  const totalInvestment = investments.reduce(
    (sum, investment) => sum + investment.request_amount,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">My Investments</h1>

      {investments.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <p className="text-xl text-center text-gray-600">
              You haven't made any investments yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Investment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-3">Project Name</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => (
                      <tr key={investment.project_id} className="border-b border-blue-100">
                        <td className="p-3">{investment.project_title}</td>
                        <td className="p-3">
                          {investment.project_description.substring(0, 50)}...
                        </td>
                        <td className="p-3">${investment.request_amount.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="text-green-600">Accepted</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
