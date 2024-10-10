"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClockIcon, MapPinIcon, UsersIcon } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, type View, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";

const localizer = momentLocalizer(moment);

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

interface EventRegistration {
  id: number;
  event_id: number;
  session_id: number;
  user_id: number;
  booking_date: Date;
}

const initialMockEvents: Event[] = [
  {
    id: 1,
    title: "AI Research Symposium",
    description: "Annual symposium on the latest AI research and applications.",
    start_date: new Date(2024, 9, 15),
    end_date: new Date(2024, 9, 17),
    location: "Virtual",
    is_virtual: true,
    max_attendees: 500,
    registration_deadline: new Date(2024, 9, 10),
    status: "Upcoming",
    sessions: [
      {
        id: 1,
        event_id: 1,
        title: "Opening Keynote",
        description: "Welcome address and introduction to the symposium",
        start_time: new Date(2024, 9, 15, 9, 0),
        end_time: new Date(2024, 9, 15, 10, 0),
        location: "Main Virtual Room",
        max_attendees: 500,
      },
    ],
  },
  {
    id: 2,
    title: "Quantum Computing Workshop",
    description: "Hands-on workshop exploring quantum computing principles.",
    start_date: new Date(2024, 9, 20),
    end_date: new Date(2024, 9, 20),
    location: "Research Lab A, Building 3",
    is_virtual: false,
    max_attendees: 50,
    registration_deadline: new Date(2024, 9, 18),
    status: "Open for Registration",
    sessions: [
      {
        id: 1,
        event_id: 2,
        title: "Introduction to Quantum Computing",
        description: "Overview of quantum computing and its applications",
        start_time: new Date(2024, 9, 20, 10, 0),
        end_time: new Date(2024, 9, 20, 11, 0),
        location: "Research Lab A, Building 3",
        max_attendees: 50,
      },
    ],
  },
];

type ViewType = "month" | "week" | "day";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    location: "",
    is_virtual: false,
    max_attendees: 0,
    registration_deadline: new Date(),
    status: "Upcoming",
  });
  const [view, setView] = useState<ViewType>("month");
  const [date, setDate] = useState(new Date());
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  const router = useRouter();

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(
        JSON.parse(storedEvents, (key, value) => {
          if (key === "start_date" || key === "end_date" || key === "registration_deadline") {
            return new Date(value);
          }
          return value;
        }),
      );
    } else {
      setEvents(initialMockEvents);
      localStorage.setItem("events", JSON.stringify(initialMockEvents));
    }

    // Load registrations from localStorage
    const storedRegistrations = localStorage.getItem("registrations");
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
  }, []);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEventWithId = { ...newEvent, id: Date.now(), sessions: [] } as Event;
    const updatedEvents = [...events, newEventWithId];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setIsCreateEventOpen(false);
    setNewEvent({
      title: "",
      description: "",
      start_date: new Date(),
      end_date: new Date(),
      location: "",
      is_virtual: false,
      max_attendees: 0,
      registration_deadline: new Date(),
      status: "Upcoming",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: ViewType) => {
    setView(newView);
  }, []);

  const handleRegister = (eventId: number, sessionId: number) => {
    const newRegistration: EventRegistration = {
      id: Date.now(),
      event_id: eventId,
      session_id: sessionId,
      user_id: 1, // Assuming a logged-in user with ID 1
      booking_date: new Date(),
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

    // Navigate to the reservations page
    router.push("/reservations");
  };

  const isSessionRegistered = (eventId: number, sessionId: number) => {
    return registrations.some((reg) => reg.event_id === eventId && reg.session_id === sessionId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Research Events Calendar</h1>
        <div className="space-x-4">
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button>Create New Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    placeholder="Enter event description"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={moment(newEvent.start_date).format("YYYY-MM-DD")}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={moment(newEvent.end_date).format("YYYY-MM-DD")}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    placeholder="Enter event location"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_virtual"
                    name="is_virtual"
                    checked={newEvent.is_virtual}
                    onCheckedChange={(checked) =>
                      setNewEvent((prev) => ({ ...prev, is_virtual: checked as boolean }))
                    }
                  />
                  <Label htmlFor="is_virtual">Virtual Event</Label>
                </div>
                <div>
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    name="max_attendees"
                    type="number"
                    value={newEvent.max_attendees}
                    onChange={handleInputChange}
                    placeholder="Enter maximum number of attendees"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registration_deadline">Registration Deadline</Label>
                  <Input
                    id="registration_deadline"
                    name="registration_deadline"
                    type="date"
                    value={moment(newEvent.registration_deadline).format("YYYY-MM-DD")}
                    onChange={handleDateChange}
                    required
                  />
                </div>
                <Button type="submit">Create Event</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-white shadow-lg mb-6">
        <CardContent className="p-0">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start_date"
            endAccessor="end_date"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
            view={view}
            onView={(newView: View) => handleViewChange(newView as ViewType)}
            date={date}
            onNavigate={handleNavigate}
            views={["month", "week", "day"]}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card className="bg-white shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-700">
              {selectedEvent.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{selectedEvent.description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="w-4 h-4 mr-2" />
                {moment(selectedEvent.start_date).format("MMM D, YYYY")} -{" "}
                {moment(selectedEvent.end_date).format("MMM D, YYYY")}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {selectedEvent.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="w-4 h-4 mr-2" />
                Max Attendees: {selectedEvent.max_attendees}
              </div>
              <Badge variant={selectedEvent.is_virtual ? "secondary" : "default"}>
                {selectedEvent.is_virtual ? "Virtual" : "In-person"}
              </Badge>
              <div className="text-sm text-gray-600">
                Registration Deadline:{" "}
                {moment(selectedEvent.registration_deadline).format("MMM D, YYYY")}
              </div>
              <div className="text-sm font-semibold text-blue-700">
                Status: {selectedEvent.status}
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sessions">
                  <AccordionTrigger>Event Sessions</AccordionTrigger>
                  <AccordionContent>
                    {selectedEvent.sessions && selectedEvent.sessions.length > 0 ? (
                      selectedEvent.sessions.map((session) => (
                        <div key={session.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
                          <h4 className="font-semibold">{session.title}</h4>
                          <p className="text-sm text-gray-600">{session.description}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {moment(session.start_time).format("MMM D, YYYY HH:mm")} -
                            {moment(session.end_time).format("HH:mm")}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {session.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <UsersIcon className="w-4 h-4 mr-1" />
                            Max Attendees: {session.max_attendees}
                          </div>
                          {isSessionRegistered(selectedEvent.id, session.id) ? (
                            <Badge className="mt-2" variant="secondary">
                              Registered
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleRegister(selectedEvent.id, session.id)}
                              className="mt-2"
                            >
                              Register for Session
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No sessions available for this event.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
