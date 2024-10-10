"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface EventRegistration {
  id: number;
  event_id: number;
  session_id: number;
  user_id: number;
  booking_date: Date;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: string;
  is_virtual: boolean;
  max_attendees: number;
  registration_deadline: Date;
  status: string;
  sessions: EventSession[];
}

interface EventSession {
  id: number;
  event_id: number;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  location: string;
  max_attendees: number;
}

export default function ReservationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedRegistrations = localStorage.getItem("registrations");
    const storedEvents = localStorage.getItem("events");

    if (storedRegistrations) {
      setRegistrations(
        JSON.parse(storedRegistrations, (key, value) => {
          if (key === "booking_date") {
            return new Date(value);
          }
          return value;
        }),
      );
    }

    if (storedEvents) {
      setEvents(
        JSON.parse(storedEvents, (key, value) => {
          if (
            key === "start_date" ||
            key === "end_date" ||
            key === "registration_deadline" ||
            key === "start_time" ||
            key === "end_time"
          ) {
            return new Date(value);
          }
          return value;
        }),
      );
    }
  }, []);

  const getEventDetails = (eventId: number) => {
    return events.find((event) => event.id === eventId);
  };

  const getSessionDetails = (eventId: number, sessionId: number) => {
    const event = getEventDetails(eventId);
    return event?.sessions.find((session) => session.id === sessionId);
  };

  const handleBackToEvents = () => {
    router.push("/events");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">My Reservations</h1>
        <Button onClick={handleBackToEvents}>Back to Events</Button>
      </div>

      {registrations.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {registrations.map((registration) => {
            const event = getEventDetails(registration.event_id);
            const session = getSessionDetails(registration.event_id, registration.session_id);

            if (!event || !session) {
              return null;
            }

            return (
              <Card key={registration.id} className="mb-4 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-700">
                    {event.title} - {session.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {moment(session.start_time).format("MMM D, YYYY")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      {moment(session.start_time).format("HH:mm")} -{" "}
                      {moment(session.end_time).format("HH:mm")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {session.location}
                    </div>
                    <p className="text-sm font-semibold text-blue-700">
                      Booked on: {moment(registration.booking_date).format("MMM D, YYYY HH:mm")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ScrollArea>
      ) : (
        <Card className="bg-white shadow-lg p-6 text-center">
          <p className="text-lg mb-4">You haven't made any reservations yet.</p>
          <Link href="/events" className="text-blue-600 hover:underline">
            Browse available events
          </Link>
        </Card>
      )}
    </div>
  );
}
