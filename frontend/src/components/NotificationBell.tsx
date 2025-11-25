"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, X } from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent } from "./ui/card";

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    relatedId?: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get("/notifications");
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.read).length);
        } catch (error) {
            // Silent fail - notifications are not critical
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getNotificationColor = (type: string) => {
        const colors = {
            task: 'bg-green-100 border-green-300',
            weather: 'bg-blue-100 border-blue-300',
            inventory: 'bg-orange-100 border-orange-300',
            livestock: 'bg-purple-100 border-purple-300',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 border-gray-300';
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white border-b p-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>
                        <CardContent className="p-0">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className={`mt-1 p-1.5 rounded-full border ${getNotificationColor(notification.type)}`}>
                                                    <Bell className="h-3 w-3" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{notification.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
