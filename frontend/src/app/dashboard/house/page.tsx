"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Power, Settings, X, Droplets, Lightbulb, Lock, Fan } from "lucide-react";

interface HouseActivity {
    _id: string;
    name: string;
    type: string;
    status: string;
    lastUpdated: string;
}

export default function HouseActivitiesPage() {
    const [activities, setActivities] = useState<HouseActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<HouseActivity | null>(null);
    const [newActivity, setNewActivity] = useState({ name: '', type: 'water' });

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const { data } = await api.get("/house");
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch house activities", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await api.put(`/house/${id}/status`, { status: newStatus });
            fetchActivities();
        } catch (error) {
            console.error("Failed to toggle status", error);
        }
    };

    const openConfig = (activity: HouseActivity) => {
        setSelectedActivity(activity);
        setShowConfigModal(true);
    };

    const handleConfigSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedActivity) return;

        try {
            await api.put(`/house/${selectedActivity._id}/config`, {
                name: selectedActivity.name,
                type: selectedActivity.type,
            });
            setShowConfigModal(false);
            fetchActivities();
        } catch (error) {
            console.error("Failed to update configuration", error);
        }
    };

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/house', {
                name: newActivity.name,
                type: newActivity.type,
            });
            setShowAddModal(false);
            setNewActivity({ name: '', type: 'water' });
            fetchActivities();
        } catch (error) {
            console.error("Failed to add activity", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'water':
                return <Droplets className="h-6 w-6" />;
            case 'light':
                return <Lightbulb className="h-6 w-6" />;
            case 'security':
                return <Lock className="h-6 w-6" />;
            case 'ventilation':
                return <Fan className="h-6 w-6" />;
            default:
                return <Home className="h-6 w-6" />;
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-500' : 'bg-gray-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">House Activities</h1>
                    <p className="text-muted-foreground">Monitor and control household systems</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
                    + Add New Activity
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
                        <Home className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{activities.length}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Power className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {activities.filter(a => a.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <Power className="h-5 w-5 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-600">
                            {activities.filter(a => a.status === 'inactive').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activities Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>System Controls</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Home className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No house activities configured</p>
                            <p className="text-sm text-muted-foreground">Add systems to start monitoring.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.map((activity) => (
                                <div
                                    key={activity._id}
                                    className="border rounded-xl p-6 hover:shadow-lg transition-all hover:border-green-500"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${activity.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {getIcon(activity.type)}
                                        </div>
                                        <button
                                            onClick={() => openConfig(activity)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Settings className="h-5 w-5 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize mb-4">{activity.type}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}></div>
                                            <span className="text-sm font-medium capitalize">{activity.status}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={activity.status === 'active' ? 'destructive' : 'default'}
                                            onClick={() => toggleStatus(activity._id, activity.status)}
                                        >
                                            {activity.status === 'active' ? 'Turn Off' : 'Turn On'}
                                        </Button>
                                    </div>

                                    {activity.lastUpdated && (
                                        <p className="text-xs text-muted-foreground mt-3">
                                            Last updated: {new Date(activity.lastUpdated).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Configuration Modal */}
            {showConfigModal && selectedActivity && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Configure {selectedActivity.name}</CardTitle>
                                <button onClick={() => setShowConfigModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleConfigSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>System Name</Label>
                                    <Input
                                        value={selectedActivity.name}
                                        onChange={(e) => setSelectedActivity({ ...selectedActivity, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select
                                        value={selectedActivity.type}
                                        onChange={(e) => setSelectedActivity({ ...selectedActivity, type: e.target.value })}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="water">Water System</option>
                                        <option value="light">Lighting</option>
                                        <option value="security">Security</option>
                                        <option value="ventilation">Ventilation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowConfigModal(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Add Activity Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add New House Activity</CardTitle>
                                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddActivity} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>System Name</Label>
                                    <Input
                                        value={newActivity.name}
                                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                                        placeholder="e.g., Main Water Pump"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select
                                        value={newActivity.type}
                                        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="water">Water System</option>
                                        <option value="light">Lighting</option>
                                        <option value="security">Security</option>
                                        <option value="ventilation">Ventilation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                        Add Activity
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
