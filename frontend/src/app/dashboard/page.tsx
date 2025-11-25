"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    DollarSign,
    CheckCircle,
    TrendingUp,
    Sprout,
    Beef,
    ShoppingCart,
    Plus,
    Calendar as CalendarIcon,
    AlertCircle,
    Clock,
    CloudSun,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [salesRes, tasksRes, cropsRes, livestockRes, weatherRes] = await Promise.all([
                api.get('/sales').catch(() => ({ data: [] })),
                api.get('/tasks').catch(() => ({ data: [] })),
                api.get('/crops').catch(() => ({ data: [] })),
                api.get('/livestock').catch(() => ({ data: [] })),
                api.get('/weather').catch(() => ({ data: null })),
            ]);

            // Calculate stats
            const totalRevenue = salesRes.data.reduce((sum: number, sale: any) => sum + (sale.totalAmount || 0), 0);
            const pendingTasks = tasksRes.data.filter((t: any) => t.status !== 'completed').length;
            const activeCrops = cropsRes.data.filter((c: any) => c.status === 'growing').length;
            const totalAnimals = livestockRes.data.length;

            setStats({
                totalRevenue,
                pendingTasks,
                activeCrops,
                totalAnimals,
                totalSales: salesRes.data.length,
                completedTasks: tasksRes.data.filter((t: any) => t.status === 'completed').length,
            });

            // Recent activities (last 10)
            const allActivities = [
                ...salesRes.data.map((s: any) => ({
                    type: 'sale',
                    title: `Sale: ${s.itemName}`,
                    description: `KES ${s.totalAmount.toLocaleString()}`,
                    date: s.saleDate,
                    icon: DollarSign,
                    color: 'text-green-600'
                })),
                ...tasksRes.data.filter((t: any) => t.status === 'completed').map((t: any) => ({
                    type: 'task',
                    title: `Completed: ${t.title}`,
                    description: t.assignedTo || 'Unassigned',
                    date: t.completedAt || t.createdAt,
                    icon: CheckCircle,
                    color: 'text-blue-600'
                })),
                ...cropsRes.data.slice(0, 5).map((c: any) => ({
                    type: 'crop',
                    title: `Crop: ${c.cropName}`,
                    description: `${c.status}`,
                    date: c.plantedDate,
                    icon: Sprout,
                    color: 'text-green-600'
                })),
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

            setActivities(allActivities);

            // Upcoming tasks
            const upcoming = tasksRes.data
                .filter((t: any) => t.status !== 'completed' && t.dueDate)
                .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5);
            setUpcomingTasks(upcoming);

            // Revenue trend (mock data for last 6 months)
            const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
                const month = new Date();
                month.setMonth(month.getMonth() - (5 - i));
                const monthSales = salesRes.data.filter((s: any) => {
                    const saleDate = new Date(s.saleDate);
                    return saleDate.getMonth() === month.getMonth();
                });
                return {
                    month: month.toLocaleDateString('en-US', { month: 'short' }),
                    revenue: monthSales.reduce((sum: number, s: any) => sum + s.totalAmount, 0)
                };
            });
            setRevenueData(monthlyRevenue);

            setWeather(weatherRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Mokua Farm Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">Welcome to your family farm management system</p>
                </div>
                <div className="text-6xl">🌾</div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            KES {stats?.totalRevenue?.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.totalSales || 0} sales recorded
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                        <Clock className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats?.pendingTasks || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.completedTasks || 0} completed
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growing Crops</CardTitle>
                        <Sprout className="h-5 w-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats?.activeCrops || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active fields</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Livestock</CardTitle>
                        <Beef className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats?.totalAnimals || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Animals in herd</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href="/dashboard/tasks">
                            <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Task
                            </Button>
                        </Link>
                        <Link href="/dashboard/sales">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Record Sale
                            </Button>
                        </Link>
                        <Link href="/dashboard/crops">
                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700" size="lg">
                                <Sprout className="h-4 w-4 mr-2" />
                                Add Crop
                            </Button>
                        </Link>
                        <Link href="/dashboard/livestock/new">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                                <Beef className="h-4 w-4 mr-2" />
                                Add Animal
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Trend */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Revenue Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: any) => `KES ${value.toLocaleString()}`} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Weather Summary */}
                {weather && (
                    <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-sky-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CloudSun className="h-5 w-5" />
                                Current Weather
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-5xl font-bold">{Math.round(weather.main?.temp || 0)}°C</p>
                                        <p className="text-lg text-muted-foreground capitalize">
                                            {weather.weather?.[0]?.description}
                                        </p>
                                    </div>
                                    <div className="text-6xl">
                                        {weather.weather?.[0]?.main === 'Clear' ? '☀️' :
                                            weather.weather?.[0]?.main === 'Clouds' ? '☁️' :
                                                weather.weather?.[0]?.main === 'Rain' ? '🌧️' : '🌤️'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Humidity</p>
                                        <p className="font-semibold">{weather.main?.humidity}%</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Wind</p>
                                        <p className="font-semibold">{weather.wind?.speed} m/s</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Feels Like</p>
                                        <p className="font-semibold">{Math.round(weather.main?.feels_like || 0)}°C</p>
                                    </div>
                                </div>
                                <Link href="/dashboard/weather">
                                    <Button variant="outline" className="w-full">
                                        View Full Forecast
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activities.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No recent activity</p>
                            ) : (
                                activities.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{activity.title}</p>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Upcoming Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingTasks.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
                            ) : (
                                upcomingTasks.map((task) => {
                                    const isOverdue = new Date(task.dueDate) < new Date();
                                    return (
                                        <div
                                            key={task._id}
                                            className={`p-3 rounded-lg border ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                                                } transition-colors`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="font-medium">{task.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {task.assignedTo || 'Unassigned'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </p>
                                                    {isOverdue && (
                                                        <span className="text-xs text-red-600">Overdue</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <Link href="/dashboard/tasks">
                            <Button variant="outline" className="w-full mt-4">
                                View All Tasks
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
