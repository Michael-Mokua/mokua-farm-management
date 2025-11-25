"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import { User, Mail, Phone, Shield, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: "",
        profileImage: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, profileImage: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await api.put(`/auth/profile`, formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Image Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            onUploadComplete={handleImageUpload}
                            currentImage={formData.profileImage}
                            folder="profiles"
                        />
                    </CardContent>
                </Card>

                {/* Profile Information Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Role:</span>
                                    <span className="font-medium capitalize">{user?.role}</span>
                                </div>
                            </div>

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                                    Profile updated successfully!
                                </div>
                            )}

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Family Members Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Mokua Family Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Patrick Mokua', role: 'Farm Manager', email: 'patrick@mselele.com', color: 'bg-green-500' },
                            { name: 'Carolyne Nyamoita', role: 'Operations & Finance', email: 'carolyne@mselele.com', color: 'bg-blue-500' },
                            { name: 'Fadhili Obiria', role: 'Field Supervisor', email: 'fadhili@mselele.com', color: 'bg-orange-500' },
                            { name: 'Michael Ogutu', role: 'Tech Administrator', email: 'michael@mselele.com', color: 'bg-purple-500' },
                        ].map((member, idx) => (
                            <div key={idx} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto`}>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-semibold text-center">{member.name}</h3>
                                <p className="text-sm text-muted-foreground text-center">{member.role}</p>
                                <p className="text-xs text-muted-foreground text-center mt-1">{member.email}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
