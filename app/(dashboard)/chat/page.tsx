"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

interface Researcher {
  id: string;
  name: string;
  specialization: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [currentUser, setCurrentUser] = useState<string>("You");
  const [researcher, setResearcher] = useState<Researcher | null>(null);

  const searchParams = useSearchParams();
  const researcherId = searchParams.get("researcherId");

  useEffect(() => {
    // Fetch researcher data
    const researchersString = localStorage.getItem("researchers");
    if (researchersString) {
      const researchers: Researcher[] = JSON.parse(researchersString);
      const selectedResearcher = researchers.find((r) => r.id === researcherId);
      if (selectedResearcher) {
        setResearcher(selectedResearcher);
        // Simulating initial messages
        setMessages([
          {
            id: 1,
            sender: selectedResearcher.name,
            content: `Hello! I'm ${selectedResearcher.name}. I specialize in ${selectedResearcher.specialization}. How can I help you today?`,
            timestamp: new Date(Date.now() - 1000000),
          },
        ]);
      }
    }
  }, [researcherId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message: Message = {
        id: Date.now(),
        sender: currentUser,
        content: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  if (!researcher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with {researcher.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 p-4 border rounded">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === currentUser ? "bg-blue-100 text-right" : "bg-gray-100"
                }`}
              >
                <div className="font-semibold">{message.sender}</div>
                <div>{message.content}</div>
                <div className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
