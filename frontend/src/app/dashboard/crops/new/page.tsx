"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewCropPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        variety: "",
        fieldLocation: "",
        plantingDate: "",
        expectedHarvestDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/crops", formData);
            router.push("/dashboard/crops");
        } catch (error) {
            console.error("Failed to create crop", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Crop</h1>
                <p className="text-muted-foreground">Register a new planting cycle</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Crop Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Crop Name</Label>
                                <Input id="name" placeholder="e.g. Maize" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="variety">Variety</Label>
                                <Input id="variety" placeholder="e.g. Hybrid 614" value={formData.variety} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fieldLocation">Field Location</Label>
                            <Input id="fieldLocation" placeholder="e.g. Lower Field A" value={formData.fieldLocation} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="plantingDate">Planting Date</Label>
                                <Input id="plantingDate" type="date" value={formData.plantingDate} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expectedHarvestDate">Expected Harvest</Label>
                                <Input id="expectedHarvestDate" type="date" value={formData.expectedHarvestDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Crop
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
