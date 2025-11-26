"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Package, X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    description: string;
}

export default function StoreAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "",
        stock: "",
        description: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/products', newProduct);
            setProducts([...products, data]);
            setShowModal(false);
            setNewProduct({
                name: "",
                price: "",
                image: "",
                stock: "",
                description: ""
            });
        } catch (error) {
            console.error("Failed to create product", error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Store Management</h2>
                    <p className="text-muted-foreground">
                        Manage products for the public storefront.
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Products Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price (KES)</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            {product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell className="max-w-xs truncate text-muted-foreground">
                                        {product.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Product Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Add New Product</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (KES)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Product</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
