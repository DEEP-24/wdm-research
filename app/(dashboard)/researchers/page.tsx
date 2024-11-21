"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Researcher {
  id: string;
  firstName: string;
  lastName: string;
  expertise: string;
  researchInterests: string;
  imageURL: string;
  isFollowing: boolean;
  isFollowingYou: boolean;
}

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      const response = await fetch("/api/researchers");
      if (!response.ok) {
        throw new Error("Failed to fetch researchers");
      }
      const data = await response.json();
      setResearchers(data);
    } catch (error) {
      console.error("Error fetching researchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (researcherId: string) => {
    try {
      const response = await fetch("/api/researchers/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ researcherId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow");
      }

      setResearchers((prev) =>
        prev.map((researcher) =>
          researcher.id === researcherId
            ? { ...researcher, isFollowing: !researcher.isFollowing }
            : researcher,
        ),
      );
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading researchers...</p>
      </div>
    );
  }

  if (researchers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Connect with Researchers</h1>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No researchers found at the moment.</p>
          <p className="text-gray-500 mt-2">Please check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Connect with Researchers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchers.map((researcher) => (
          <Card key={researcher.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={researcher.imageURL}
                alt={`${researcher.firstName} ${researcher.lastName}`}
                layout="fill"
                objectFit="cover"
                objectPosition="center top"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {researcher.firstName} {researcher.lastName}
                {researcher.isFollowingYou && (
                  <span className="text-sm font-normal text-blue-600 ml-2">Follows you</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-600 font-medium">Expertise</p>
                <p className="text-sm">{researcher.expertise}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Research Interests</p>
                <p className="text-sm">{researcher.researchInterests}</p>
              </div>
              <div className="flex gap-2">
                {researcher.isFollowing ? (
                  <>
                    <Button
                      onClick={() => handleFollow(researcher.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      Unfollow
                    </Button>
                    <Link href={`/chat?researcherId=${researcher.id}`} className="flex-1">
                      <Button className="w-full">Chat</Button>
                    </Link>
                  </>
                ) : (
                  <Button onClick={() => handleFollow(researcher.id)} className="w-full">
                    Follow
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
