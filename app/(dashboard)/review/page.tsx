"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
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
import { EyeIcon, MessageCircleIcon, PaperclipIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Attachment {
  name: string;
  type: string;
}

interface ProjectProposal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  submitted_at: string;
  attachments: Attachment[];
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
                <TableHead>Attachments</TableHead>
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
                    {proposal.attachments && proposal.attachments.length > 0 ? (
                      <div className="flex items-center text-sm text-blue-600">
                        <PaperclipIcon className="w-4 h-4 mr-2" />
                        {proposal.attachments.length} file(s)
                      </div>
                    ) : (
                      <span className="text-gray-400">No attachments</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Single Dialog component outside of the map function */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          {selectedProposal && (
            <>
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
                  Submitted: {new Date(selectedProposal.submitted_at).toLocaleString()}
                </div>
                {selectedProposal.attachments && selectedProposal.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-700">Attachments:</h3>
                    <ul className="list-disc pl-5">
                      {selectedProposal.attachments.map((attachment, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <li key={index} className="text-sm text-blue-600">
                          <PaperclipIcon className="w-4 h-4 inline mr-2" />
                          {attachment.name} ({attachment.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-700">Reviews:</h3>
                  {getProposalReviews(selectedProposal.id).map((review) => (
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
