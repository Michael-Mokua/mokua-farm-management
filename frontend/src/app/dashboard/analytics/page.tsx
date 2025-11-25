"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Sprout, Beef, Calendar } from "lucide-react";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [financeData, setFinanceData] = useState<any[]>([]);
    const [cropData, setCropData] = useState<any[]>([]);
    const [livestockData, setLivestockData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        profitMargin: 0,
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const [financeRes, cropsRes, livestockRes] = await Promise.all([
                api.get('/finance'),
                api.get('/crops'),
                api.get('/livestock'),
            ]);

            // Process finance data
            const income = financeRes.data.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0);
            const expense = financeRes.data.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0);
            const profit = income - expense;

            setStats({
                totalIncome: income,
                totalExpense: expense,
                netProfit: profit,
                profitMargin: income > 0 ? (profit / income) * 100 : 0,
            });

            // Group finance by category
            const categoryData = financeRes.data.reduce((acc: any, item: any) => {
                const existing = acc.find((a: any) => a.category === item.category);
                if (existing) {
                    existing.amount += item.amount;
                } else {
                    acc.push({ category: item.category, amount: item.amount, type: item.type });
                }
                return acc;
            }, []);
            setFinanceData(categoryData);

            // Process crop data
            const cropsByStatus = cropsRes.data.reduce((acc: any, crop: any) => {
                const existing = acc.find((a: any) => a.status === crop.status);
                if (existing) {
                    existing.count += 1;
                } else {
                    acc.push({ status: crop.status, count: 1 });
                }
                return acc;
            }, []);
            setCropData(cropsByStatus);

            // Process livestock data
            const livestockByType = livestockRes.data.reduce((acc: any, animal: any) => {
                const existing = acc.find((a: any) => a.type === animal.type);
                if (existing) {
                    existing.count += 1;
                } else {
                    acc.push({ type: animal.type, count: 1 });
                }
                return acc;
            }, []);
            setLivestockData(livestockByType);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch analytics data', error);
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
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                <p className="text-muted-foreground">Comprehensive farm performance insights</p>
            </div>

            {/* Financial KPIs */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">KES {stats.totalIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">KES {stats.totalExpense.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <DollarSign className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            KES {stats.netProfit.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                        <Calendar className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats.profitMargin.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Overall</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Finance by Category */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {financeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: any) => `KES ${value.toLocaleString()}`}
                                    />
                                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No financial data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Crop Status Distribution */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5" />
                            Crop Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {cropData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={cropData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {cropData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No crop data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Livestock Distribution */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Beef className="h-5 w-5" />
                            Livestock by Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {livestockData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={livestockData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ type, count }) => `${type}: ${count}`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {livestockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No livestock data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Farm Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Crops</p>
                                    <p className="text-2xl font-bold text-green-600">{cropData.reduce((sum, c) => sum + c.count, 0)}</p>
                                </div>
                                <Sprout className="h-10 w-10 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Livestock</p>
                                    <p className="text-2xl font-bold text-blue-600">{livestockData.reduce((sum, l) => sum + l.count, 0)}</p>
                                </div>
                                <Beef className="h-10 w-10 text-blue-600" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue Growth</p>
                                    <p className="text-2xl font-bold text-purple-600">+12.5%</p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
