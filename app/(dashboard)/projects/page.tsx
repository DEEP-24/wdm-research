"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/types/user";
import { EyeIcon, FileTextIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const mockProposals: ProjectProposal[] = [
  {
    id: 1,
    user_id: 1,
    title: "AI-powered Climate Change Prediction Model",
    description:
      "Developing an advanced AI model to predict climate change impacts with higher accuracy.",
    status: "Under Review",
    submitted_at: "2023-06-15T10:30:00Z",
  },
  {
    id: 2,
    user_id: 2,
    title: "Quantum Encryption for Secure Communication",
    description:
      "Implementing quantum encryption techniques for ultra-secure communication channels.",
    status: "Approved",
    submitted_at: "2023-06-10T14:45:00Z",
  },
];

const mockReviews: ProposalReview[] = [
  {
    id: 1,
    proposal_id: 1,
    reviewer_id: 3,
    feedback: "Interesting concept. Please provide more details on the AI model architecture.",
    reviewed_at: "2023-06-16T09:00:00Z",
  },
  {
    id: 2,
    proposal_id: 2,
    reviewer_id: 4,
    feedback: "Excellent proposal. Approved for further development.",
    reviewed_at: "2023-06-12T11:30:00Z",
  },
];

export default function ProjectsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [reviews, setReviews] = useState<ProposalReview[]>([]);
  const [newProposal, setNewProposal] = useState<Partial<ProjectProposal>>({
    title: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProjectProposal | null>(null);
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
    } else {
      setProposals(mockProposals);
      localStorage.setItem("projectProposals", JSON.stringify(mockProposals));
    }

    const storedReviews = localStorage.getItem("proposalReviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(mockReviews);
      localStorage.setItem("proposalReviews", JSON.stringify(mockReviews));
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProposal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const proposal: ProjectProposal = {
        ...(newProposal as ProjectProposal),
        id: Date.now(),
        user_id: currentUser.id,
        status: "Submitted",
        submitted_at: new Date().toISOString(),
      };
      const updatedProposals = [...proposals, proposal];
      setProposals(updatedProposals);
      localStorage.setItem("projectProposals", JSON.stringify(updatedProposals));
      setNewProposal({ title: "", description: "" });
      setIsDialogOpen(false);
      toast.success("Project proposal submitted successfully!");
    }
  };

  const handleReview = (proposalId: number, feedback: string) => {
    if (currentUser) {
      const newReview: ProposalReview = {
        id: Date.now(),
        proposal_id: proposalId,
        reviewer_id: currentUser.id,
        feedback,
        reviewed_at: new Date().toISOString(),
      };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem("proposalReviews", JSON.stringify(updatedReviews));
      toast.success("Review submitted successfully");
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">Project Proposals</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <SendIcon className="w-4 h-4 mr-2" /> Submit New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-700">
                Submit New Proposal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-blue-600">
                  Project Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newProposal.title}
                  onChange={handleInputChange}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-blue-600">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProposal.description}
                  onChange={handleInputChange}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Submit Proposal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-700">All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.title}</TableCell>
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
                  <TableCell>User ID: {proposal.user_id}</TableCell>
                  <TableCell>{new Date(proposal.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <EyeIcon className="w-4 h-4 mr-2" /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {currentUser.role === "admin" && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-700">
              All Proposals (Admin View)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          const feedback = prompt("Enter feedback for this proposal:");
                          if (feedback) {
                            handleReview(proposal.id, feedback);
                          }
                        }}
                      >
                        <MessageCircleIcon className="w-4 h-4 mr-2" /> Add Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedProposal && (
        <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-700">
                {selectedProposal.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{selectedProposal.description}</p>
              <div className="text-sm text-gray-600">
                Status: <Badge variant="secondary">{selectedProposal.status}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Submitted by: User ID {selectedProposal.user_id}
              </div>
              <div className="text-sm text-gray-600">
                Submitted: {new Date(selectedProposal.submitted_at).toLocaleString()}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-700">Reviews:</h3>
                {getProposalReviews(selectedProposal.id).map((review) => (
                  <div key={review.id} className="bg-gray-100 p-3 rounded">
                    <p className="text-sm">{review.feedback}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed by: User ID {review.reviewer_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reviewed on: {new Date(review.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
