"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShoppingBag, Phone, Loader2, Sprout } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    description: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleOrder = (product: Product) => {
        const message = `Hi, I'm interested in buying ${product.name} (Price: KES ${product.price}). Is it available?`;
        const whatsappUrl = `https://wa.me/254110254359?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Sprout className="h-6 w-6" />
                        <span>Mselele Farm Shop</span>
                    </Link>
                    <div className="ml-auto">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 md:px-6 py-8">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Fresh from the Farm</h1>
                    <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        Quality produce grown with care at Mselele Farm. Order directly via WhatsApp.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
                                <div className="aspect-square relative bg-muted flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
                                    )}
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Badge variant="destructive" className="text-lg px-4 py-1">Out of Stock</Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <span className="font-bold text-green-600">KES {product.price}</span>
                                    </div>
                                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button
                                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleOrder(product)}
                                        disabled={product.stock <= 0}
                                    >
                                        <Phone className="h-4 w-4" />
                                        Order on WhatsApp
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-20" />
                                <p>No products available at the moment. Check back soon!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
                &copy; {new Date().getFullYear()} Mselele Farm.
            </footer>
        </div>
    );
}
