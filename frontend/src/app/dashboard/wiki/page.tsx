"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, BookOpen, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Article {
    id: string;
    title: string;
    category: string;
    content: string;
    author: string;
    createdAt: string;
}

export default function WikiPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newArticle, setNewArticle] = useState({
        title: "",
        category: "General",
        content: ""
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data } = await api.get('/wiki');
            setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/wiki', newArticle);
            setArticles([data, ...articles]);
            setShowModal(false);
            setNewArticle({
                title: "",
                category: "General",
                content: ""
            });
        } catch (error) {
            console.error("Failed to create article", error);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ["General", "Crops", "Livestock", "Equipment", "Finance", "SOPs"];

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
                    <p className="text-muted-foreground">
                        Farm guides, SOPs, and historical records.
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Article
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 max-w-md"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary">{article.category}</Badge>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <CardTitle className="mt-2">{article.title}</CardTitle>
                            <CardDescription>By {article.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                                {article.content}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {filteredArticles.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-20" />
                        <p>No articles found. Create one to get started.</p>
                    </div>
                )}
            </div>

            {/* Add Article Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4 border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Create New Article</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleCreateArticle} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newArticle.title}
                                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newArticle.category}
                                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newArticle.content}
                                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Article</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
