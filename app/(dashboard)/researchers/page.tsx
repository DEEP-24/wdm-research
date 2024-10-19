"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Researcher {
  id: string;
  name: string;
  specialization: string;
  photo: string;
}

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);

  useEffect(() => {
    // Simulating researchers data with high-quality images
    const sampleResearchers: Researcher[] = [
      {
        id: "1",
        name: "Dr. Emily Chen",
        specialization: "Quantum Computing",
        photo:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "2",
        name: "Prof. Michael Johnson",
        specialization: "Machine Learning",
        photo:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "3",
        name: "Dr. Sarah Patel",
        specialization: "Bioinformatics",
        photo:
          "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "4",
        name: "Dr. David Kim",
        specialization: "Nanotechnology",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "5",
        name: "Prof. Olivia Garcia",
        specialization: "Artificial Intelligence",
        photo:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "6",
        name: "Dr. James Wilson",
        specialization: "Robotics",
        photo:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      },
    ];

    localStorage.setItem("researchers", JSON.stringify(sampleResearchers));
    setResearchers(sampleResearchers);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Connect with Researchers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchers.map((researcher) => (
          <Card key={researcher.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={researcher.photo}
                alt={researcher.name}
                layout="fill"
                objectFit="cover"
                objectPosition="center top"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{researcher.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">{researcher.specialization}</p>
              <Link href={`/chat?researcherId=${researcher.id}`}>
                <Button className="w-full">Chat with {researcher.name}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
