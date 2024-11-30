"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit support request");
      }

      toast.success("Request submitted successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (_error) {
      toast.error("Failed to submit support request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    field: string,
  ) => {
    if (typeof e === "string") {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Support</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              className="w-full"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              className="w-full"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            id="subject"
            placeholder="Subject"
            className="w-full"
            value={formData.subject}
            onChange={(e) => handleChange(e, "subject")}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="Your message"
            rows={5}
            className="w-full"
            value={formData.message}
            onChange={(e) => handleChange(e, "message")}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;
