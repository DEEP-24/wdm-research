"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { disconnectSocket, getSocket, initializeSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  sentAt: string;
  sender: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

interface ChatComponentProps {
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientProfile: {
    firstName: string;
    lastName: string;
  } | null;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatComponent({
  recipientId,
  recipientName,
  recipientEmail,
  recipientProfile,
  currentUserId,
  isOpen,
  onClose,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUserId || !isOpen) {
      return;
    }

    const socket = initializeSocket(currentUserId);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socket.on("receive-message", (message: Message) => {
      if (message.senderId === recipientId || message.receiverId === recipientId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    fetchMessages();

    return () => {
      disconnectSocket();
    };
  }, [currentUserId, recipientId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!currentUserId) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages?userId=${recipientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: recipientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      const socket = getSocket();
      if (socket) {
        socket.emit("send-message", {
          content: newMessage,
          senderId: currentUserId,
          receiverId: recipientId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${recipientName}`}
              />
              <AvatarFallback>
                {recipientProfile?.firstName?.[0]}
                {recipientProfile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{recipientName}</h2>
              <p className="text-sm text-muted-foreground">{recipientEmail}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUserId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.sentAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={sendMessage}
        className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected || isLoading}
          />
          <Button type="submit" disabled={!newMessage.trim() || !isConnected || isLoading}>
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
