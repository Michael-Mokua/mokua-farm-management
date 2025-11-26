"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Sprout,
    Beef,
    CalendarCheck,
    BarChart3,
    Package,
    Wallet,
    Home,
    CloudSun,
    LogOut,
    Menu,
    X,
    DollarSign,
    Calendar as CalendarIcon,
    BookOpen,
    Users,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";
import GlobalSearch from "@/components/GlobalSearch";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Crops", href: "/dashboard/crops", icon: Sprout },
        { name: "Livestock", href: "/dashboard/livestock", icon: Beef },
        { name: "Tasks", href: "/dashboard/tasks", icon: CalendarCheck },
        { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
        { name: "Wiki", href: "/dashboard/wiki", icon: BookOpen },
        { name: "Contacts", href: "/dashboard/contacts", icon: Users },
        { name: "Store", href: "/dashboard/store", icon: Store },
        { name: "Sales", href: "/dashboard/sales", icon: DollarSign },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Inventory", href: "/dashboard/inventory", icon: Package },
        { name: "Finance", href: "/dashboard/finance", icon: Wallet },
        { name: "House", href: "/dashboard/house", icon: Home },
        { name: "Weather", href: "/dashboard/weather", icon: CloudSun },
    ];

    return (
        <>
            <GlobalSearch />
            <div className="flex h-screen bg-muted/20">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out md:static md:translate-x-0",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex h-16 items-center justify-between px-6 border-b bg-gradient-to-r from-green-600 to-emerald-600">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌾</span>
                            <div>
                                <h1 className="text-xl font-bold text-white">Mokua Farm</h1>
                                <p className="text-xs text-green-100">Family Management</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col h-[calc(100vh-4rem)] justify-between p-4">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Family Members Section */}
                        <div className="mt-auto mb-4 border-t pt-4">
                            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">FAMILY MEMBERS</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xl">👨‍🌾</span>
                                    <span className="font-medium">Patrick</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xl">👩‍🌾</span>
                                    <span className="font-medium">Carolyne</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xl">👦</span>
                                    <span className="font-medium">Fadhili</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xl">👦</span>
                                    <span className="font-medium">Michael</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="px-3 py-2 mb-2">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={logout}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex-1" />
                        <NotificationBell />
                    </header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
