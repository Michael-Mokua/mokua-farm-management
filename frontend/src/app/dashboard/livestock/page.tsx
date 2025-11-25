"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Beef, TrendingUp, Heart, Milk } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Livestock {
    _id: string;
    tagId: string;
    name: string;
    type: string;
    breed: string;
    status: string;
    image?: string;
    healthRecords?: any[];
    productionLogs?: any[];
}

export default function LivestockPage() {
    const [livestock, setLivestock] = useState<Livestock[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState<Livestock | null>(null);

    useEffect(() => {
        fetchLivestock();
    }, []);

    const fetchLivestock = async () => {
        try {
            const { data } = await api.get("/livestock");
            setLivestock(data);
        } catch (error) {
            console.error("Failed to fetch livestock", error);
        } finally {
            setLoading(false);
        }
    };

    const getAnimalIcon = (type: string) => {
        return <Beef className="h-5 w-5" />;
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Livestock Management</h1>
                    <p className="text-muted-foreground">Track and manage your herd</p>
                </div>
                <Link href="/dashboard/livestock/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Animal
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                        <Beef className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{livestock.length}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Healthy</CardTitle>
                        <Heart className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {livestock.filter(l => l.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Milk Production</CardTitle>
                        <Milk className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">0L</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">KES 0</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Livestock Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Herd Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : livestock.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Beef className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No livestock found</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Register your first animal to start tracking.
                            </p>
                            <Link href="/dashboard/livestock/new">
                                <Button variant="outline">Add Animal</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {livestock.map((animal) => (
                                <div
                                    key={animal._id}
                                    className="group relative border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                    onClick={() => setSelectedAnimal(animal)}
                                >
                                    {/* Animal Image */}
                                    <div className="relative w-full h-40 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg mb-4 overflow-hidden">
                                        {animal.image ? (
                                            <Image
                                                src={animal.image}
                                                alt={animal.name || animal.tagId}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Beef className="h-16 w-16 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Animal Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg">{animal.name || animal.tagId}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                                                {animal.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {getAnimalIcon(animal.type)}
                                            <span className="capitalize">{animal.type}</span>
                                            <span>•</span>
                                            <span>{animal.breed}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Tag: {animal.tagId}
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <p className="text-muted-foreground">Health Records</p>
                                            <p className="font-semibold">{animal.healthRecords?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Production Logs</p>
                                            <p className="font-semibold">{animal.productionLogs?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
