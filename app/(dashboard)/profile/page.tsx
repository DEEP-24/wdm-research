"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/types/user";
import { UserRole } from "@prisma/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [papers, setPapers] = useState<string[]>([]);
  const [newPaper, setNewPaper] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
        setPapers(userData.papers ? JSON.parse(userData.papers) : []);
      } catch (error) {
        toast.error("Error loading profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...(prevUser as User),
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const updatedUser = {
          ...user,
          papers: JSON.stringify(papers),
        };

        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        setIsEditing(false);
        toast.success("Profile Updated", {
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        toast.error("Error updating profile");
        console.error(error);
      }
    }
  };

  const addPaper = () => {
    if (newPaper.trim()) {
      setPapers([...papers, newPaper.trim()]);
      setNewPaper("");
    }
  };

  const removePaper = (index: number) => {
    setPapers(papers.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">User Profile</h1>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-700">
            {isEditing ? "Edit Profile" : "Profile Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={user?.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={user?.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user?.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={user?.role}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="researchInterests">Research Interests</Label>
              <Textarea
                id="researchInterests"
                name="researchInterests"
                value={user?.researchInterests}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="expertise">Expertise</Label>
              <Textarea
                id="expertise"
                name="expertise"
                value={user?.expertise}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedInURL">LinkedIn URL</Label>
                <Input
                  id="linkedInURL"
                  name="linkedInURL"
                  value={user?.linkedInURL || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="twitterURL">Twitter URL</Label>
                <Input
                  id="twitterURL"
                  name="twitterURL"
                  value={user?.twitterURL || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="githubURL">GitHub URL</Label>
              <Input
                id="githubURL"
                name="githubURL"
                value={user?.githubURL || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {user?.role === UserRole.USER && (
              <div>
                <Label>Research Papers and Articles</Label>
                <ul className="list-disc pl-5 mb-2">
                  {papers.map((paper, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="flex items-center justify-between">
                      <span>{paper}</span>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaper(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newPaper}
                      onChange={(e) => setNewPaper(e.target.value)}
                      placeholder="Add new paper or article"
                    />
                    <Button type="button" onClick={addPaper}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
