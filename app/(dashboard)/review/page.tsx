"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { EyeIcon, MessageCircleIcon } from "lucide-react";
import type { User } from "@/types/user";

interface ProjectProposal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  submitted_at: string;
}

interface ProposalReview {
  id: number;
  proposal_id: number;
  reviewer_id: number;
  feedback: string;
  reviewed_at: string;
}

export default function AllProjectsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [reviews, setReviews] = useState<ProposalReview[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ProjectProposal | null>(null);
  const [newFeedback, setNewFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/login");
    }

    const storedProposals = localStorage.getItem("projectProposals");
    if (storedProposals) {
      setProposals(JSON.parse(storedProposals));
    }

    const storedReviews = localStorage.getItem("proposalReviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [router]);

  const handleAddFeedback = () => {
    if (currentUser && selectedProposal && newFeedback.trim()) {
      const newReview: ProposalReview = {
        id: Date.now(),
        proposal_id: selectedProposal.id,
        reviewer_id: currentUser.id,
        feedback: newFeedback.trim(),
        reviewed_at: new Date().toISOString(),
      };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem("proposalReviews", JSON.stringify(updatedReviews));
      setNewFeedback("");
      toast.success("Feedback submitted successfully");
      setIsDialogOpen(false); // Close the dialog
    }
  };

  const getProposalReviews = (proposalId: number) => {
    return reviews.filter((review) => review.proposal_id === proposalId);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">All Project Proposals</h1>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-700">Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.title}</TableCell>
                  <TableCell>User ID: {proposal.user_id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        proposal.status === "Approved"
                          ? "default"
                          : proposal.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(proposal.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setIsDialogOpen(true);
                          }}
                        >
                          <EyeIcon className="w-4 h-4 mr-2" /> View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold text-blue-700">
                            {proposal.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>{proposal.description}</p>
                          <div className="text-sm text-gray-600">
                            Status: <Badge variant="secondary">{proposal.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Submitted: {new Date(proposal.submitted_at).toLocaleString()}
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-blue-700">Reviews:</h3>
                            {getProposalReviews(proposal.id).map((review) => (
                              <div key={review.id} className="bg-gray-100 p-3 rounded">
                                <p className="text-sm">{review.feedback}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Reviewed on: {new Date(review.reviewed_at).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newFeedback" className="text-blue-600">
                              Add Feedback
                            </Label>
                            <Textarea
                              id="newFeedback"
                              value={newFeedback}
                              onChange={(e) => setNewFeedback(e.target.value)}
                              className="border-blue-200 focus:border-blue-400"
                            />
                            <Button onClick={handleAddFeedback} className="w-full">
                              <MessageCircleIcon className="w-4 h-4 mr-2" /> Submit Feedback
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
