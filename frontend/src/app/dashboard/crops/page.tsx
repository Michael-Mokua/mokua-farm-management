"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sprout } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Crop {
    _id: string;
    name: string;
    variety: string;
    fieldLocation: string;
    plantingDate: string;
    status: string;
}

export default function CropsPage() {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const { data } = await api.get("/crops");
            setCrops(data);
        } catch (error) {
            console.error("Failed to fetch crops", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Crops</h1>
                    <p className="text-muted-foreground">Manage your fields and harvests</p>
                </div>
                <Link href="/dashboard/crops/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Crop
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Crops</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : crops.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <Sprout className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No crops found</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start by adding your first crop field.
                            </p>
                            <Link href="/dashboard/crops/new">
                                <Button variant="outline">Add Crop</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Variety</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Planting Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {crops.map((crop) => (
                                        <tr key={crop._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{crop.name}</td>
                                            <td className="p-4 align-middle">{crop.variety}</td>
                                            <td className="p-4 align-middle">{crop.fieldLocation}</td>
                                            <td className="p-4 align-middle">{format(new Date(crop.plantingDate), 'PPP')}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${crop.status === 'planted' ? 'bg-blue-100 text-blue-800' :
                                                        crop.status === 'growing' ? 'bg-green-100 text-green-800' :
                                                            crop.status === 'harvested' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {crop.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Link href={`/dashboard/crops/${crop._id}`}>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
