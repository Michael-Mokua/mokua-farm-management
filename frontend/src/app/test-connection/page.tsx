"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function TestConnectionPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [apiUrl, setApiUrl] = useState("");

    useEffect(() => {
        // Get the API URL from the env var (client-side accessible if prefixed with NEXT_PUBLIC_)
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || "Not set");
        checkConnection();
    }, []);

    const checkConnection = async () => {
        setLoading(true);
        setError("");
        setStatus(null);

        try {
            const { data } = await api.get("/health");
            setStatus(data);
        } catch (err: any) {
            console.error("Connection check failed:", err);
            setError(err.message || "Failed to connect to backend");
            if (err.response) {
                setStatus({
                    status: "error",
                    statusCode: err.response.status,
                    data: err.response.data
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Backend Connection Test</CardTitle>
                    <CardDescription>
                        Verifying connectivity to the API server.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg text-sm font-mono break-all">
                        <strong>API URL:</strong> {apiUrl}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2">Connecting...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error ? (
                                <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                    <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">Connection Failed</h3>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            ) : status?.status === "ok" ? (
                                <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">Connection Successful</h3>
                                        <div className="text-sm mt-1 space-y-1">
                                            <p>Status: {status.status}</p>
                                            <p>Firestore: {status.firestore}</p>
                                            <p>Timestamp: {status.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg">
                                    <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">Unexpected Response</h3>
                                        <pre className="text-xs mt-1 overflow-auto max-h-40">
                                            {JSON.stringify(status, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            <Button onClick={checkConnection} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry Connection
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
