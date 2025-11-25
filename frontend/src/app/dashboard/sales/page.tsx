"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, ShoppingCart, Users, Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Sale {
    _id: string;
    type: string;
    itemName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    buyer: string;
    buyerContact: string;
    saleDate: any;
    paymentStatus: 'paid' | 'pending' | 'partial';
    notes: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [newSale, setNewSale] = useState({
        type: 'crop',
        itemName: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        buyer: '',
        buyerContact: '',
        saleDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'paid' as const,
        notes: ''
    });

    useEffect(() => {
        fetchSales();
        fetchAnalytics();
    }, []);

    const fetchSales = async () => {
        try {
            const { data } = await api.get("/sales");
            setSales(data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get("/sales/analytics");
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    };

    const handleAddSale = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/sales', newSale);
            setShowAddModal(false);
            setNewSale({
                type: 'crop',
                itemName: '',
                quantity: '',
                unit: 'kg',
                pricePerUnit: '',
                buyer: '',
                buyerContact: '',
                saleDate: new Date().toISOString().split('T')[0],
                paymentStatus: 'paid',
                notes: ''
            });
            fetchSales();
            fetchAnalytics();
        } catch (error) {
            console.error("Failed to create sale", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            paid: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Paid ✓' },
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Pending' },
            partial: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Partial' },
        };
        const s = config[status as keyof typeof config] || config.paid;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>
                {s.label}
            </span>
        );
    };

    const chartData = analytics?.byType ? Object.entries(analytics.byType).map(([type, data]: any) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: data.revenue
    })) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Sales & Revenue
                    </h1>
                    <p className="text-muted-foreground">Track your farm's income and customers</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Sale
                </Button>
            </div>

            {/* Stats Cards */}
            {analytics && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600">
                                KES {analytics.totalRevenue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{analytics.totalSales}</div>
                            <p className="text-xs text-muted-foreground mt-1">Transactions</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paid</CardTitle>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{analytics.paidSales}</div>
                            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Users className="h-5 w-5 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-600">{analytics.pendingSales}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue by Type Chart */}
                {chartData.length > 0 && (
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Revenue by Product Type</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => `KES ${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Sales */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {sales.slice(0, 5).map((sale) => (
                                <div
                                    key={sale._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{sale.itemName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {sale.quantity} {sale.unit} × KES {sale.pricePerUnit}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-emerald-600">
                                            KES {sale.totalAmount.toLocaleString()}
                                        </p>
                                        {getStatusBadge(sale.paymentStatus)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {sales.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No sales recorded yet</p>
                                <p className="text-sm text-muted-foreground mt-1">Record your first sale to start tracking revenue</p>
                            </div>
                        ) : (
                            sales.map((sale) => (
                                <div
                                    key={sale._id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-all hover:border-emerald-500"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{sale.itemName}</h3>
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                                    {sale.type}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div>
                                                    <span className="font-medium">Quantity:</span> {sale.quantity} {sale.unit}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Price/Unit:</span> KES {sale.pricePerUnit}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Buyer:</span> {sale.buyer}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {new Date(sale.saleDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {sale.notes && (
                                                <p className="text-sm text-muted-foreground mt-2 italic">
                                                    Note: {sale.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-2xl font-bold text-emerald-600 mb-2">
                                                KES {sale.totalAmount.toLocaleString()}
                                            </div>
                                            {getStatusBadge(sale.paymentStatus)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add Sale Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Record New Sale
                                </CardTitle>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-gray-100 p-2 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleAddSale} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Product Type *</Label>
                                        <select
                                            value={newSale.type}
                                            onChange={(e) => setNewSale({ ...newSale, type: e.target.value })}
                                            className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="crop">🌾 Crop</option>
                                            <option value="livestock">🐄 Livestock</option>
                                            <option value="produce">🥬 Produce</option>
                                            <option value="other">📦 Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Item Name *</Label>
                                        <Input
                                            value={newSale.itemName}
                                            onChange={(e) => setNewSale({ ...newSale, itemName: e.target.value })}
                                            placeholder="e.g., Tomatoes"
                                            required
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Quantity *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={newSale.quantity}
                                            onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                                            placeholder="100"
                                            required
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Unit *</Label>
                                        <select
                                            value={newSale.unit}
                                            onChange={(e) => setNewSale({ ...newSale, unit: e.target.value })}
                                            className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="bags">bags</option>
                                            <option value="pieces">pieces</option>
                                            <option value="liters">liters</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Price/Unit (KES) *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={newSale.pricePerUnit}
                                            onChange={(e) => setNewSale({ ...newSale, pricePerUnit: e.target.value })}
                                            placeholder="50"
                                            required
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {newSale.quantity && newSale.pricePerUnit && (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="text-3xl font-bold text-emerald-600">
                                            KES {(parseFloat(newSale.quantity) * parseFloat(newSale.pricePerUnit)).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Buyer Name *</Label>
                                        <Input
                                            value={newSale.buyer}
                                            onChange={(e) => setNewSale({ ...newSale, buyer: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Buyer Contact</Label>
                                        <Input
                                            value={newSale.buyerContact}
                                            onChange={(e) => setNewSale({ ...newSale, buyerContact: e.target.value })}
                                            placeholder="+254..."
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sale Date *</Label>
                                        <Input
                                            type="date"
                                            value={newSale.saleDate}
                                            onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                                            required
                                            className="border-2 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Status *</Label>
                                        <select
                                            value={newSale.paymentStatus}
                                            onChange={(e) => setNewSale({ ...newSale, paymentStatus: e.target.value as any })}
                                            className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="paid">✓ Paid</option>
                                            <option value="pending">⏳ Pending</option>
                                            <option value="partial">½ Partial</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <textarea
                                        value={newSale.notes}
                                        onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                                        placeholder="Additional details..."
                                        className="w-full min-h-[60px] px-3 py-2 border-2 rounded-md focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                    >
                                        Record Sale
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
