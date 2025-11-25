"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, DollarSign, Calendar, Receipt, X } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinanceRecord {
    _id: string;
    type: string;
    category: string;
    amount: number;
    date: string;
    description: string;
    receiptImage?: string;
}

export default function FinancePage() {
    const [records, setRecords] = useState<FinanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        receiptImage: '',
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const { data } = await api.get("/finance");
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch finance records", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/finance", {
                ...formData,
                amount: parseFloat(formData.amount),
            });
            setShowAddModal(false);
            setFormData({
                type: 'expense',
                category: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                receiptImage: '',
            });
            fetchRecords();
        } catch (error) {
            console.error("Failed to add record", error);
        }
    };

    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    const netProfit = totalIncome - totalExpense;

    // Group by month for chart
    const monthlyData = records.reduce((acc: any[], record) => {
        const month = format(new Date(record.date), 'MMM yyyy');
        const existing = acc.find(item => item.month === month);
        if (existing) {
            if (record.type === 'income') {
                existing.income += record.amount;
            } else {
                existing.expense += record.amount;
            }
        } else {
            acc.push({
                month,
                income: record.type === 'income' ? record.amount : 0,
                expense: record.type === 'expense' ? record.amount : 0,
            });
        }
        return acc;
    }, []).slice(-6);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finance Management</h1>
                    <p className="text-muted-foreground">Track income, expenses, and financial health</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Transaction
                </Button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">KES {totalIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <ArrowDownLeft className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">KES {totalExpense.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <DollarSign className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            KES {netProfit.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            {netProfit >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <p className="text-xs text-muted-foreground">Overall</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <Receipt className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{records.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total records</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Income vs Expenses Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value: any) => `KES ${value.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No financial data yet
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transactions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No transactions found</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Record your first transaction to start tracking finances.
                            </p>
                            <Button onClick={() => setShowAddModal(true)} variant="outline">Add Transaction</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {records.map((record) => (
                                <div
                                    key={record._id}
                                    className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all hover:border-green-500"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-3 rounded-xl ${record.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {record.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{record.description || record.category}</p>
                                                {record.receiptImage && (
                                                    <Receipt className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="capitalize">{record.category}</span>
                                                <span>•</span>
                                                <span>{format(new Date(record.date), 'PPP')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {record.type === 'income' ? '+' : '-'} KES {record.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add Transaction</CardTitle>
                                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="e.g., Sales, Feed, Seeds"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Amount (KES)</Label>
                                        <Input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of transaction"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Receipt (Optional)</Label>
                                    <ImageUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, receiptImage: url })}
                                        currentImage={formData.receiptImage}
                                        folder="receipts"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Add Transaction
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
