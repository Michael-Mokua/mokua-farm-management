"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, AlertTriangle, TrendingDown, X } from "lucide-react";

interface InventoryItem {
    _id: string;
    itemName: string;
    category: string;
    quantity: number;
    unit: string;
    reorderLevel: number;
    costPerUnit: number;
    supplier: string;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        quantity: '',
        unit: '',
        reorderLevel: '',
        costPerUnit: '',
        supplier: '',
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data } = await api.get("/inventory");
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/inventory", {
                ...formData,
                quantity: parseFloat(formData.quantity),
                reorderLevel: parseFloat(formData.reorderLevel),
                costPerUnit: parseFloat(formData.costPerUnit),
            });
            setShowAddModal(false);
            setFormData({
                itemName: '',
                category: '',
                quantity: '',
                unit: '',
                reorderLevel: '',
                costPerUnit: '',
                supplier: '',
            });
            fetchItems();
        } catch (error) {
            console.error("Failed to add item", error);
        }
    };

    const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'seeds': 'bg-green-100 text-green-800',
            'feed': 'bg-yellow-100 text-yellow-800',
            'tools': 'bg-blue-100 text-blue-800',
            'fertilizer': 'bg-purple-100 text-purple-800',
            'medicine': 'bg-red-100 text-red-800',
        };
        return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <p className="text-muted-foreground">Track supplies and stock levels</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Item
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{items.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">In stock</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{lowStockItems.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <TrendingDown className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">KES {totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Inventory worth</p>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="h-5 w-5" />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {lowStockItems.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.itemName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Current: {item.quantity} {item.unit} | Reorder at: {item.reorderLevel} {item.unit}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                        Low Stock
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Inventory List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Items</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No inventory items</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add your first item to start tracking inventory.
                            </p>
                            <Button onClick={() => setShowAddModal(true)} variant="outline">Add Item</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="border rounded-xl p-4 hover:shadow-lg transition-all hover:border-green-500"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{item.itemName}</h3>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        {item.quantity <= item.reorderLevel && (
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quantity:</span>
                                            <span className="font-medium">{item.quantity} {item.unit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Reorder Level:</span>
                                            <span className="font-medium">{item.reorderLevel} {item.unit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Cost/Unit:</span>
                                            <span className="font-medium">KES {item.costPerUnit}</span>
                                        </div>
                                        {item.supplier && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Supplier:</span>
                                                <span className="font-medium">{item.supplier}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">Total Value</span>
                                            <span className="font-bold text-green-600">
                                                KES {(item.quantity * item.costPerUnit).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add Inventory Item</CardTitle>
                                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Item Name</Label>
                                        <Input
                                            value={formData.itemName}
                                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                            placeholder="e.g., Maize Seeds"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="seeds">Seeds</option>
                                            <option value="feed">Feed</option>
                                            <option value="tools">Tools</option>
                                            <option value="fertilizer">Fertilizer</option>
                                            <option value="medicine">Medicine</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Unit</Label>
                                        <Input
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            placeholder="kg, liters, etc."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reorder Level</Label>
                                        <Input
                                            type="number"
                                            value={formData.reorderLevel}
                                            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cost per Unit (KES)</Label>
                                        <Input
                                            type="number"
                                            value={formData.costPerUnit}
                                            onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Supplier (Optional)</Label>
                                        <Input
                                            value={formData.supplier}
                                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                            placeholder="Supplier name"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Add Item
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
