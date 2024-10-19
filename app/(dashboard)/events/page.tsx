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
import { ClockIcon, MapPinIcon, Pencil, PlusIcon, TrashIcon, UsersIcon } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, type View, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  {
    id: 3,
    title: "Data Science Conference",
    description: "Annual conference on the latest trends in data science and machine learning.",
    start_date: new Date(2024, 9, 23), // October 23, 2024
    end_date: new Date(2024, 9, 24), // October 24, 2024
    location: "Tech Center, Downtown",
    is_virtual: false,
    max_attendees: 300,
    registration_deadline: new Date(2024, 9, 15), // October 15, 2024
    status: "Upcoming",
    sessions: [
      {
        id: 1,
        event_id: 3,
        title: "Keynote: The Future of AI",
        description: "Opening keynote on the future of artificial intelligence",
        start_time: new Date(2024, 9, 23, 9, 0), // October 23, 2024, 9:00 AM
        end_time: new Date(2024, 9, 23, 10, 30), // October 23, 2024, 10:30 AM
        location: "Main Auditorium",
        max_attendees: 300,
      },
    ],
  },
  {
    id: 4,
    title: "Cybersecurity Workshop",
    description: "Hands-on workshop on the latest cybersecurity practices and tools.",
    start_date: new Date(2024, 9, 28), // October 28, 2024
    end_date: new Date(2024, 9, 29), // October 29, 2024
    location: "Virtual",
    is_virtual: true,
    max_attendees: 100,
    registration_deadline: new Date(2024, 9, 21), // October 21, 2024
    status: "Open for Registration",
    sessions: [
      {
        id: 1,
        event_id: 4,
        title: "Ethical Hacking Basics",
        description: "Introduction to ethical hacking and penetration testing",
        start_time: new Date(2024, 9, 28, 10, 0), // October 28, 2024, 10:00 AM
        end_time: new Date(2024, 9, 28, 12, 0), // October 28, 2024, 12:00 PM
        location: "Virtual Room 1",
        max_attendees: 50,
      },
    ],
  },
  {
    id: 5,
    title: "Blockchain Technology Symposium",
    description: "Exploring the latest developments in blockchain and cryptocurrency.",
    start_date: new Date(2024, 9, 30), // October 30, 2024
    end_date: new Date(2024, 9, 31), // October 31, 2024
    location: "Financial District Conference Center",
    is_virtual: false,
    max_attendees: 200,
    registration_deadline: new Date(2024, 9, 25), // October 25, 2024
    status: "Upcoming",
    sessions: [
      {
        id: 1,
        event_id: 5,
        title: "DeFi: Revolutionizing Finance",
        description: "Panel discussion on Decentralized Finance and its impact",
        start_time: new Date(2024, 9, 30, 11, 0), // October 30, 2024, 11:00 AM
        end_time: new Date(2024, 9, 30, 12, 30), // October 30, 2024, 12:30 PM
        location: "Main Hall",
        max_attendees: 200,
      },
    ],
  },
  {
    id: 6,
    title: "Machine Learning Workshop",
    description: "Hands-on workshop on advanced machine learning techniques.",
    start_date: new Date(2024, 10, 5), // November 5, 2024
    end_date: new Date(2024, 10, 6), // November 6, 2024
    location: "Tech Hub, Downtown",
    is_virtual: false,
    max_attendees: 100,
    registration_deadline: new Date(2024, 9, 25), // October 25, 2024
    status: "Upcoming",
    sessions: [
      {
        id: 1,
        event_id: 6,
        title: "Introduction to Deep Learning",
        description: "Overview of deep learning architectures and applications",
        start_time: new Date(2024, 10, 5, 9, 0), // November 5, 2024, 9:00 AM
        end_time: new Date(2024, 10, 5, 12, 0), // November 5, 2024, 12:00 PM
        location: "Main Hall, Tech Hub",
        max_attendees: 100,
      },
    ],
  },
  {
    id: 7,
    title: "Cybersecurity Conference",
    description: "Annual conference on the latest trends and threats in cybersecurity.",
    start_date: new Date(2024, 10, 15), // November 15, 2024
    end_date: new Date(2024, 10, 17), // November 17, 2024
    location: "Virtual",
    is_virtual: true,
    max_attendees: 500,
    registration_deadline: new Date(2024, 10, 10), // November 10, 2024
    status: "Upcoming",
    sessions: [
      {
        id: 1,
        event_id: 7,
        title: "Keynote: The Future of Cybersecurity",
        description: "Opening keynote on emerging cybersecurity challenges",
        start_time: new Date(2024, 10, 15, 10, 0), // November 15, 2024, 10:00 AM
        end_time: new Date(2024, 10, 15, 11, 30), // November 15, 2024, 11:30 AM
        location: "Virtual Main Hall",
        max_attendees: 500,
      },
    ],
  },
  {
    id: 8,
    title: "Data Science Hackathon",
    description: "48-hour hackathon focused on solving real-world data science problems.",
    start_date: new Date(2024, 10, 22), // November 22, 2024
    end_date: new Date(2024, 10, 24), // November 24, 2024
    location: "Innovation Center",
    is_virtual: false,
    max_attendees: 200,
    registration_deadline: new Date(2024, 10, 15), // November 15, 2024
    status: "Open for Registration",
    sessions: [
      {
        id: 1,
        event_id: 8,
        title: "Hackathon Kickoff",
        description: "Introduction to the hackathon challenges and rules",
        start_time: new Date(2024, 10, 22, 9, 0), // November 22, 2024, 9:00 AM
        end_time: new Date(2024, 10, 22, 10, 0), // November 22, 2024, 10:00 AM
        location: "Main Auditorium, Innovation Center",
        max_attendees: 200,
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
  const [newSessions, setNewSessions] = useState<Partial<EventSession>[]>([
    {
      title: "",
      description: "",
      start_time: new Date(),
      end_time: new Date(),
      location: "",
      max_attendees: 0,
    },
  ]);
  const [view, setView] = useState<ViewType>("month");
  const [date, setDate] = useState(new Date());
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

    // Load current user from localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEventWithId = {
      ...newEvent,
      id: Date.now(),
      sessions: newSessions.map((session, index) => ({
        ...session,
        id: Date.now() + index,
        event_id: Date.now(),
      })),
    } as Event;
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
    setNewSessions([
      {
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        location: "",
        max_attendees: 0,
      },
    ]);
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

  const handleSessionInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewSessions((prev) =>
      prev.map((session, i) =>
        i === index ? { ...session, [name]: type === "number" ? Number(value) : value } : session,
      ),
    );
  };

  const handleSessionDateChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSessions((prev) =>
      prev.map((session, i) => (i === index ? { ...session, [name]: new Date(value) } : session)),
    );
  };

  const addSession = () => {
    setNewSessions((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        location: "",
        max_attendees: 0,
      },
    ]);
  };

  const removeSession = (index: number) => {
    setNewSessions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: ViewType) => {
    setView(newView);
  }, []);

  const handleRegister = (eventId: number, sessionId: number) => {
    if (currentUser?.role !== "user") {
      toast.error("Only users can register for sessions.");
      return;
    }

    const newRegistration: EventRegistration = {
      id: Date.now(),
      event_id: eventId,
      session_id: sessionId,
      user_id: currentUser.id, // Use the current user's ID
      booking_date: new Date(),
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

    toast.success("You have successfully registered for the session.");

    // Navigate to the reservations page
    router.push("/reservations");
  };

  const isSessionRegistered = (eventId: number, sessionId: number) => {
    return registrations.some((reg) => reg.event_id === eventId && reg.session_id === sessionId);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditEventOpen(true);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event,
    );
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setIsEditEventOpen(false);
    setEditingEvent(null);
    setSelectedEvent(updatedEvent);
    toast.success("Event updated successfully");
  };

  const handleDeleteEvent = (eventId: number) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    toast.success("The event has been successfully removed.");
    setSelectedEvent(null);
  };

  const handleDeleteSession = (eventId: number, sessionId: number) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          sessions: event.sessions.filter((session) => session.id !== sessionId),
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    toast.success("The session has been successfully removed.");
    setSelectedEvent(updatedEvents.find((event) => event.id === eventId) || null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">Events</h1>
        <div className="w-full sm:w-auto">
          {currentUser?.role === "organizer" && (
            <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Create New Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-blue-700">
                    Create New Event
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-blue-600">
                          Event Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={newEvent.title}
                          onChange={handleInputChange}
                          placeholder="Enter event title"
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-blue-600">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={newEvent.description}
                          onChange={handleInputChange}
                          placeholder="Enter event description"
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="start_date" className="text-blue-600">
                          Start Date
                        </Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={moment(newEvent.start_date).format("YYYY-MM-DD")}
                          onChange={handleDateChange}
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date" className="text-blue-600">
                          End Date
                        </Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={moment(newEvent.end_date).format("YYYY-MM-DD")}
                          onChange={handleDateChange}
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location" className="text-blue-600">
                          Location
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={newEvent.location}
                          onChange={handleInputChange}
                          placeholder="Enter event location"
                          required
                          className="border-blue-200 focus:border-blue-400"
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
                          className="border-blue-400 text-blue-600"
                        />
                        <Label htmlFor="is_virtual" className="text-blue-600">
                          Virtual Event
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="max_attendees" className="text-blue-600">
                          Max Attendees
                        </Label>
                        <Input
                          id="max_attendees"
                          name="max_attendees"
                          type="number"
                          value={newEvent.max_attendees}
                          onChange={handleInputChange}
                          placeholder="Enter maximum number of attendees"
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registration_deadline" className="text-blue-600">
                          Registration Deadline
                        </Label>
                        <Input
                          id="registration_deadline"
                          name="registration_deadline"
                          type="date"
                          value={moment(newEvent.registration_deadline).format("YYYY-MM-DD")}
                          onChange={handleDateChange}
                          required
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Event Sessions</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {newSessions.map((session, index) => (
                        <AccordionItem
                          value={`session-${index}`}
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={index}
                          className="border-blue-200"
                        >
                          <AccordionTrigger className="text-blue-600 hover:text-blue-800">
                            Session {index + 1}
                          </AccordionTrigger>
                          <AccordionContent className="bg-blue-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`session_title_${index}`} className="text-blue-600">
                                  Session Title
                                </Label>
                                <Input
                                  id={`session_title_${index}`}
                                  name="title"
                                  value={session.title}
                                  onChange={(e) => handleSessionInputChange(index, e)}
                                  placeholder="Enter session title"
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`session_description_${index}`}
                                  className="text-blue-600"
                                >
                                  Session Description
                                </Label>
                                <Input
                                  id={`session_description_${index}`}
                                  name="description"
                                  value={session.description}
                                  onChange={(e) => handleSessionInputChange(index, e)}
                                  placeholder="Enter session description"
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <Label
                                  htmlFor={`session_start_time_${index}`}
                                  className="text-blue-600"
                                >
                                  Start Time
                                </Label>
                                <Input
                                  id={`session_start_time_${index}`}
                                  name="start_time"
                                  type="datetime-local"
                                  value={moment(session.start_time).format("YYYY-MM-DDTHH:mm")}
                                  onChange={(e) => handleSessionDateChange(index, e)}
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`session_end_time_${index}`}
                                  className="text-blue-600"
                                >
                                  End Time
                                </Label>
                                <Input
                                  id={`session_end_time_${index}`}
                                  name="end_time"
                                  type="datetime-local"
                                  value={moment(session.end_time).format("YYYY-MM-DDTHH:mm")}
                                  onChange={(e) => handleSessionDateChange(index, e)}
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <Label
                                  htmlFor={`session_location_${index}`}
                                  className="text-blue-600"
                                >
                                  Session Location
                                </Label>
                                <Input
                                  id={`session_location_${index}`}
                                  name="location"
                                  value={session.location}
                                  onChange={(e) => handleSessionInputChange(index, e)}
                                  placeholder="Enter session location"
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`session_max_attendees_${index}`}
                                  className="text-blue-600"
                                >
                                  Max Attendees
                                </Label>
                                <Input
                                  id={`session_max_attendees_${index}`}
                                  name="max_attendees"
                                  type="number"
                                  value={session.max_attendees}
                                  onChange={(e) => handleSessionInputChange(index, e)}
                                  placeholder="Enter maximum number of attendees"
                                  required
                                  className="border-blue-200 focus:border-blue-400"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSession(index)}
                                disabled={newSessions.length === 1}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <TrashIcon className="w-4 h-4 mr-2" /> Remove Session
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  /* Implement save session logic */
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Save Session
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <Button
                      type="button"
                      onClick={addSession}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" /> Add Another Session
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Create Event with Sessions
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <CardTitle className="text-xl font-semibold text-blue-700 mb-2 sm:mb-0">
                {selectedEvent.title}
              </CardTitle>
              {currentUser?.role === "organizer" && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button
                    onClick={() => handleEditEvent(selectedEvent)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit Event
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" /> Delete Event
                  </Button>
                </div>
              )}
            </div>
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
                          <div className="flex justify-between items-start">
                            <div>
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
                              ) : currentUser?.role === "user" ? (
                                <Button
                                  onClick={() => handleRegister(selectedEvent.id, session.id)}
                                  className="mt-2"
                                >
                                  Register for Session
                                </Button>
                              ) : null}
                            </div>
                            {currentUser?.role === "organizer" && (
                              <Button
                                onClick={() => handleDeleteSession(selectedEvent.id, session.id)}
                                variant="destructive"
                                size="sm"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
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

      {/* Updated Dialog for editing events */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateEvent(editingEvent);
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title" className="text-blue-600">
                    Event Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-blue-600">
                    Description
                  </Label>
                  <Input
                    id="edit-description"
                    value={editingEvent.description}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, description: e.target.value })
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-start-date" className="text-blue-600">
                    Start Date
                  </Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={moment(editingEvent.start_date).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, start_date: new Date(e.target.value) })
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-date" className="text-blue-600">
                    End Date
                  </Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={moment(editingEvent.end_date).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, end_date: new Date(e.target.value) })
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location" className="text-blue-600">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-is-virtual"
                    checked={editingEvent.is_virtual}
                    onCheckedChange={(checked) =>
                      setEditingEvent({ ...editingEvent, is_virtual: checked as boolean })
                    }
                    className="border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="edit-is-virtual" className="text-blue-600">
                    Virtual Event
                  </Label>
                </div>
                <div>
                  <Label htmlFor="edit-max-attendees" className="text-blue-600">
                    Max Attendees
                  </Label>
                  <Input
                    id="edit-max-attendees"
                    type="number"
                    value={editingEvent.max_attendees}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, max_attendees: Number(e.target.value) })
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-registration-deadline" className="text-blue-600">
                    Registration Deadline
                  </Label>
                  <Input
                    id="edit-registration-deadline"
                    type="date"
                    value={moment(editingEvent.registration_deadline).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        registration_deadline: new Date(e.target.value),
                      })
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Event Sessions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {editingEvent.sessions.map((session, index) => (
                    <AccordionItem value={`session-${index}`} key={session.id}>
                      <AccordionTrigger className="text-blue-600 hover:text-blue-800">
                        Session {index + 1}: {session.title}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-session-title-${index}`} className="text-blue-600">
                            Session Title
                          </Label>
                          <Input
                            id={`edit-session-title-${index}`}
                            value={session.title}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = { ...session, title: e.target.value };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-session-description-${index}`}
                            className="text-blue-600"
                          >
                            Description
                          </Label>
                          <Input
                            id={`edit-session-description-${index}`}
                            value={session.description}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = { ...session, description: e.target.value };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-session-start-time-${index}`}
                            className="text-blue-600"
                          >
                            Start Time
                          </Label>
                          <Input
                            id={`edit-session-start-time-${index}`}
                            type="datetime-local"
                            value={moment(session.start_time).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                start_time: new Date(e.target.value),
                              };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-session-end-time-${index}`}
                            className="text-blue-600"
                          >
                            End Time
                          </Label>
                          <Input
                            id={`edit-session-end-time-${index}`}
                            type="datetime-local"
                            value={moment(session.end_time).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                end_time: new Date(e.target.value),
                              };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-session-location-${index}`}
                            className="text-blue-600"
                          >
                            Location
                          </Label>
                          <Input
                            id={`edit-session-location-${index}`}
                            value={session.location}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = { ...session, location: e.target.value };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-session-max-attendees-${index}`}
                            className="text-blue-600"
                          >
                            Max Attendees
                          </Label>
                          <Input
                            id={`edit-session-max-attendees-${index}`}
                            type="number"
                            value={session.max_attendees}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                max_attendees: Number(e.target.value),
                              };
                              setEditingEvent({ ...editingEvent, sessions: updatedSessions });
                            }}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Update Event
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
