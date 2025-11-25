"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    status: string;
    link: string;
}

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search debounce
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
                setResults(data);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search failed", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        router.push(result.link);
        setIsOpen(false);
        setQuery("");
    };

    const getTypeColor = (type: string) => {
        const colors = {
            crop: 'bg-green-100 text-green-700',
            livestock: 'bg-purple-100 text-purple-700',
            task: 'bg-blue-100 text-blue-700',
            sale: 'bg-emerald-100 text-emerald-700',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            crop: '🌾',
            livestock: '🐄',
            task: '✓',
            sale: '💰',
        };
        return icons[type as keyof typeof icons] || '📄';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <div
                className="fixed inset-0"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Search Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search crops, livestock, tasks, sales..."
                        className="flex-1 outline-none text-lg"
                    />
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {query && results.length === 0 && !loading && (
                        <div className="p-8 text-center text-muted-foreground">
                            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No results found for "{query}"</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="p-2">
                            {results.map((result, index) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${index === selectedIndex ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-2xl">{getTypeIcon(result.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{result.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                                        {result.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t bg-gray-50 rounded-b-xl">
                    <p className="text-xs text-muted-foreground">
                        Press <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd> to close or{' '}
                        <kbd className="px-2 py-1 bg-white border rounded text-xs">⌘K</kbd> /
                        <kbd className="px-2 py-1 bg-white border rounded text-xs">Ctrl+K</kbd> to open
                    </p>
                </div>
            </div>
        </div>
    );
}
