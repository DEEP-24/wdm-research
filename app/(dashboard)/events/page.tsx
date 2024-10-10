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
import { ClockIcon, MapPinIcon, UsersIcon, PlusIcon, TrashIcon } from "lucide-react";
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
        <h1 className="text-3xl font-bold text-blue-700">Events</h1>
        <div className="space-x-4">
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button>Create New Event</Button>
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
