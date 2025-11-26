"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Plus, Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    type: string;
    description?: string;
}

export default function CalendarPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        type: "general",
        description: ""
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/events', newEvent);
            setEvents([...events, data]);
            setShowModal(false);
            setNewEvent({
                title: "",
                start: new Date().toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
                type: "general",
                description: ""
            });
        } catch (error) {
            console.error("Failed to create event", error);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        // Add empty slots for previous month days
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Add days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const eventTypeColors: Record<string, string> = {
        general: "bg-gray-500",
        planting: "bg-green-500",
        harvest: "bg-amber-500",
        market: "bg-blue-500",
        vet: "bg-red-500",
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Family Calendar</h2>
                    <p className="text-muted-foreground">
                        Schedule and track farm activities and events.
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <div key={index} className="bg-background min-h-[120px] p-2 border-t hover:bg-muted/50 transition-colors">
                                {date && (
                                    <>
                                        <div className={`text-sm font-medium mb-1 ${date.toDateString() === new Date().toDateString()
                                                ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                                                : "text-muted-foreground"
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {getEventsForDay(date).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${eventTypeColors[event.type] || "bg-primary"}`}
                                                    title={event.title}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Add Event Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Add New Event</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input
                                    id="title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input
                                        id="start"
                                        type="date"
                                        value={newEvent.start}
                                        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                    >
                                        <option value="general">General</option>
                                        <option value="planting">Planting</option>
                                        <option value="harvest">Harvest</option>
                                        <option value="market">Market Day</option>
                                        <option value="vet">Vet Visit</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Event</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
