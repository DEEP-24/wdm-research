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
import type { Event, EventRegistration, EventSession } from "@/types/event";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

const localizer = momentLocalizer(moment);

type ViewType = "month" | "week" | "day";

type EventFormValues = {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  registrationDeadline: Date;
  status: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<EventFormValues>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    isVirtual: false,
    maxAttendees: 0,
    registrationDeadline: new Date(),
    status: "Upcoming",
  });
  const [newSessions, setNewSessions] = useState<Partial<EventSession>[]>([
    {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      location: "",
      maxAttendees: 0,
    },
  ]);
  const [view, setView] = useState<ViewType>("month");
  const [date, setDate] = useState(new Date());
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const router = useRouter();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to fetch events");
      }
    };

    fetchEvents();
  }, []);

  // Fetch registrations for current user
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) {
        return;
      }

      try {
        const response = await fetch(`/api/events/register?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      }
    };

    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          sessions: newSessions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      setIsCreateEventOpen(false);
      toast.success("Event created successfully");

      // Reset form
      setNewEvent({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        location: "",
        isVirtual: false,
        maxAttendees: 0,
        registrationDeadline: new Date(),
        status: "Upcoming",
      });
      setNewSessions([
        {
          title: "",
          description: "",
          startTime: new Date(),
          endTime: new Date(),
          location: "",
          maxAttendees: 0,
        },
      ]);
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event");
    }
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
        startTime: new Date(),
        endTime: new Date(),
        location: "",
        maxAttendees: 0,
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

  const handleRegister = async (eventId: string, sessionId: string) => {
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, sessionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register for event");
      }

      const registration = await response.json();
      setRegistrations([...registrations, registration]);
      toast.success("Successfully registered for the session");
      router.push("/reservations");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error(error instanceof Error ? error.message : "Failed to register for session");
    }
  };

  const isSessionRegistered = (eventId: string, sessionId: string) => {
    return registrations.some((reg) => reg.eventId === eventId && reg.sessionId === sessionId);
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch(`/api/events/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updated = await response.json();
      setEvents(events.map((event) => (event.id === updated.id ? updated : event)));
      setIsEditEventOpen(false);
      setEditingEvent(null);
      setSelectedEvent(updated);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleDeleteSession = async (eventId: string, sessionId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

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
      toast.success("Session deleted successfully");
      setSelectedEvent(updatedEvents.find((event) => event.id === eventId) || null);
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditEventOpen(true);
  };

  console.log("Current events in state:", events);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">Events</h1>
        <div className="w-full sm:w-auto">
          {user?.role === UserRole.ORGANIZER && (
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
                          value={newEvent.description ?? ""}
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
                          value={moment(newEvent.startDate).format("YYYY-MM-DD")}
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
                          value={moment(newEvent.endDate).format("YYYY-MM-DD")}
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
                          value={newEvent.location ?? ""}
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
                          checked={newEvent.isVirtual}
                          onCheckedChange={(checked) =>
                            setNewEvent((prev) => ({ ...prev, isVirtual: checked as boolean }))
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
                          value={newEvent.maxAttendees ?? 0}
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
                          value={moment(newEvent.registrationDeadline).format("YYYY-MM-DD")}
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
                                  value={session.description ?? ""}
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
                                  value={moment(session.startTime).format("YYYY-MM-DDTHH:mm")}
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
                                  value={moment(session.endTime).format("YYYY-MM-DDTHH:mm")}
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
                                  value={session.location ?? ""}
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
                                  value={session.maxAttendees ?? 0}
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
            startAccessor={(event: Event) => event.startDate ?? new Date()}
            endAccessor={(event: Event) => event.endDate ?? new Date()}
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
              {user?.role === UserRole.ORGANIZER && (
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
                {moment(selectedEvent.startDate).format("MMM D, YYYY")} -{" "}
                {moment(selectedEvent.endDate).format("MMM D, YYYY")}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {selectedEvent.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="w-4 h-4 mr-2" />
                Max Attendees: {selectedEvent.maxAttendees}
              </div>
              <Badge variant={selectedEvent.isVirtual ? "secondary" : "default"}>
                {selectedEvent.isVirtual ? "Virtual" : "In-person"}
              </Badge>
              <div className="text-sm text-gray-600">
                Registration Deadline:{" "}
                {moment(selectedEvent.registrationDeadline).format("MMM D, YYYY")}
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
                                {moment(session.startTime).format("MMM D, YYYY HH:mm")} -
                                {moment(session.endTime).format("HH:mm")}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {session.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <UsersIcon className="w-4 h-4 mr-1" />
                                Max Attendees: {session.maxAttendees}
                              </div>
                              {isSessionRegistered(selectedEvent.id, session.id) ? (
                                <Badge className="mt-2" variant="secondary">
                                  Registered
                                </Badge>
                              ) : user?.role === UserRole.USER ? (
                                <Button
                                  onClick={() => handleRegister(selectedEvent.id, session.id)}
                                  className="mt-2"
                                >
                                  Register for Session
                                </Button>
                              ) : null}
                            </div>
                            {user?.role === UserRole.ORGANIZER && (
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
                    value={editingEvent.description ?? ""}
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
                    value={moment(editingEvent.startDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, startDate: new Date(e.target.value) })
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
                    value={moment(editingEvent.endDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, endDate: new Date(e.target.value) })
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
                    value={editingEvent.location ?? ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-is-virtual"
                    checked={editingEvent.isVirtual}
                    onCheckedChange={(checked) =>
                      setEditingEvent({ ...editingEvent, isVirtual: checked as boolean })
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
                    value={editingEvent.maxAttendees ?? 0}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, maxAttendees: Number(e.target.value) })
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
                    value={moment(editingEvent.registrationDeadline).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        registrationDeadline: new Date(e.target.value),
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
                            value={session.description ?? ""}
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
                            value={moment(session.startTime).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                startTime: new Date(e.target.value),
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
                            value={moment(session.endTime).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                endTime: new Date(e.target.value),
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
                            value={session.location ?? ""}
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
                            value={session.maxAttendees ?? 0}
                            onChange={(e) => {
                              const updatedSessions = [...editingEvent.sessions];
                              updatedSessions[index] = {
                                ...session,
                                maxAttendees: Number(e.target.value),
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
