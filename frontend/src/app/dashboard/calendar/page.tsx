"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sprout, Beef, CheckCircle, DollarSign } from "lucide-react";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'task' | 'crop' | 'livestock' | 'sale';
    status?: string;
}

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        try {
            // Fetch from all sources and aggregate
            const [tasksRes, cropsRes, livestockRes, salesRes] = await Promise.all([
                api.get('/tasks').catch(() => ({ data: [] })),
                api.get('/crops').catch(() => ({ data: [] })),
                api.get('/livestock').catch(() => ({ data: [] })),
                api.get('/sales').catch(() => ({ data: [] })),
            ]);

            const allEvents: CalendarEvent[] = [];

            // Add tasks
            tasksRes.data.forEach((task: any) => {
                if (task.dueDate) {
                    allEvents.push({
                        id: task._id,
                        title: task.title,
                        date: task.dueDate,
                        type: 'task',
                        status: task.status
                    });
                }
            });

            // Add crops (planting dates)
            cropsRes.data.forEach((crop: any) => {
                if (crop.plantedDate) {
                    allEvents.push({
                        id: crop._id,
                        title: `Plant ${crop.cropName}`,
                        date: crop.plantedDate,
                        type: 'crop'
                    });
                }
            });

            // Add sales
            salesRes.data.forEach((sale: any) => {
                if (sale.saleDate) {
                    allEvents.push({
                        id: sale._id,
                        title: `Sale: ${sale.itemName}`,
                        date: sale.saleDate,
                        type: 'sale'
                    });
                }
            });

            setEvents(allEvents);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getEventsForDay = (day: number) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return events.filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getEventColor = (type: string) => {
        const colors = {
            task: 'bg-green-100 text-green-700 border-green-300',
            crop: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            livestock: 'bg-blue-100 text-blue-700 border-blue-300',
            sale: 'bg-purple-100 text-purple-700 border-purple-300',
        };
        return colors[type as keyof typeof colors] || colors.task;
    };

    const getEventIcon = (type: string) => {
        const icons = {
            task: <CheckCircle className="h-3 w-3" />,
            crop: <Sprout className="h-3 w-3" />,
            livestock: <Beef className="h-3 w-3" />,
            sale: <DollarSign className="h-3 w-3" />,
        };
        return icons[type as keyof typeof icons] || icons.task;
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Farm Calendar
                </h1>
                <p className="text-muted-foreground">View all your farm activities in one place</p>
            </div>

            <Card className="overflow-hidden shadow-lg">
                {/* Calendar Header */}
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={previousMonth}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <CalendarIcon className="h-6 w-6" />
                            {monthName}
                        </CardTitle>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b bg-gray-50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-3 text-center font-semibold text-sm text-gray-600 border-r last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                        {days.map((day, index) => {
                            const dayEvents = day ? getEventsForDay(day) : [];
                            const isToday = day &&
                                new Date().getDate() === day &&
                                new Date().getMonth() === currentDate.getMonth() &&
                                new Date().getFullYear() === currentDate.getFullYear();

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${!day ? 'bg-gray-50' : 'hover:bg-gray-50 transition-colors'
                                        } ${isToday ? 'bg-blue-50' : ''}`}
                                >
                                    {day && (
                                        <>
                                            <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'
                                                }`}>
                                                {day}
                                                {isToday && (
                                                    <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 3).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-xs p-1.5 rounded border ${getEventColor(event.type)} flex items-center gap-1`}
                                                    >
                                                        {getEventIcon(event.type)}
                                                        <span className="truncate">{event.title}</span>
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-xs text-muted-foreground pl-1">
                                                        +{dayEvents.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Event Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <span className="text-sm">Tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-500"></div>
                            <span className="text-sm">Crops</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500"></div>
                            <span className="text-sm">Livestock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-500"></div>
                            <span className="text-sm">Sales</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
