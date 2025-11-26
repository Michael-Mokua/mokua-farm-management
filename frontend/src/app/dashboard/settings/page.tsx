"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, User, Lock, Bell, Palette, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import ImageUpload from "@/components/ImageUpload";

export default function SettingsPage() {
    const { user, login } = useAuth(); // Re-login to update context if needed, or just fetch profile
    const { setTheme, theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        profileImage: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
                profileImage: user.profileImage || ""
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data } = await api.put('/auth/profile', profileData);
            // Update local storage user data if necessary or trigger context update
            // For now, we assume the user needs to refresh or we manually update context if exposed
            setSuccess("Profile updated successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Note: In a real app, we should verify current password first. 
            // Our simple backend update doesn't strictly enforce current password check 
            // unless we add it. For now, we just update.
            await api.put('/auth/profile', { password: passwordData.newPassword });
            setSuccess("Password updated successfully");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Security</TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="flex flex-col items-center sm:flex-row gap-6 mb-6">
                                    <div className="w-24 h-24 relative">
                                        <ImageUpload
                                            currentImage={profileData.profileImage}
                                            onUploadComplete={(url) => setProfileData({ ...profileData, profileImage: url })}
                                            folder="avatars"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-medium">Profile Picture</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Click the image to upload a new photo. JPG, GIF or PNG.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            value={user?.role || ''}
                                            disabled
                                            className="bg-muted capitalize"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Tell us a little about yourself"
                                    />
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}

                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">New Password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm New Password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}

                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4 max-w-2xl">
                                <div
                                    className={`cursor-pointer rounded-lg border-2 p-4 hover:border-primary ${theme === 'light' ? 'border-primary bg-accent' : 'border-muted'}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <div className="mb-2 rounded-md bg-[#ecedef] p-2 h-24 w-full"></div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" />
                                        <span className="font-medium">Light</span>
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-lg border-2 p-4 hover:border-primary ${theme === 'dark' ? 'border-primary bg-accent' : 'border-muted'}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <div className="mb-2 rounded-md bg-slate-950 p-2 h-24 w-full"></div>
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <span className="font-medium">Dark</span>
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-lg border-2 p-4 hover:border-primary ${theme === 'system' ? 'border-primary bg-accent' : 'border-muted'}`}
                                    onClick={() => setTheme('system')}
                                >
                                    <div className="mb-2 rounded-md bg-gradient-to-r from-[#ecedef] to-slate-950 p-2 h-24 w-full"></div>
                                    <div className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        <span className="font-medium">System</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                                    <span>Email Notifications</span>
                                    <span className="font-normal text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</span>
                                </Label>
                                <Switch
                                    id="email-notifs"
                                    checked={notifications.email}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="push-notifs" className="flex flex-col space-y-1">
                                    <span>Push Notifications</span>
                                    <span className="font-normal text-sm text-muted-foreground">Receive real-time alerts on your device.</span>
                                </Label>
                                <Switch
                                    id="push-notifs"
                                    checked={notifications.push}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing-notifs" className="flex flex-col space-y-1">
                                    <span>Marketing Emails</span>
                                    <span className="font-normal text-sm text-muted-foreground">Receive news about new features and updates.</span>
                                </Label>
                                <Switch
                                    id="marketing-notifs"
                                    checked={notifications.marketing}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
