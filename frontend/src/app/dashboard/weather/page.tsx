"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, CloudRain, AlertTriangle, Sprout } from "lucide-react";

interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    visibility: number;
    sys: {
        sunrise: number;
        sunset: number;
    };
}

export default function WeatherPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        try {
            const { data } = await api.get("/weather");
            setWeather(data);
        } catch (error) {
            console.error("Failed to fetch weather", error);
        } finally {
            setLoading(false);
        }
    };

    const getFarmingRecommendations = () => {
        if (!weather) return [];

        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const condition = weather.weather[0].main.toLowerCase();

        const recommendations = [];

        if (temp > 30) {
            recommendations.push({
                icon: <Droplets className="h-5 w-5 text-blue-600" />,
                title: "Increase Irrigation",
                description: "High temperatures detected. Ensure adequate water supply for crops and livestock.",
                type: "warning"
            });
        }

        if (humidity > 80) {
            recommendations.push({
                icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
                title: "Disease Risk",
                description: "High humidity may increase fungal disease risk. Monitor crops closely.",
                type: "caution"
            });
        }

        if (condition.includes('rain')) {
            recommendations.push({
                icon: <CloudRain className="h-5 w-5 text-green-600" />,
                title: "Postpone Spraying",
                description: "Rain expected. Delay pesticide or fertilizer application.",
                type: "info"
            });
        }

        if (temp >= 20 && temp <= 28 && humidity >= 50 && humidity <= 70) {
            recommendations.push({
                icon: <Sprout className="h-5 w-5 text-green-600" />,
                title: "Ideal Planting Conditions",
                description: "Perfect weather for planting new crops.",
                type: "success"
            });
        }

        return recommendations;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <CloudSun className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Weather data unavailable</p>
                <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
            </div>
        );
    }

    const recommendations = getFarmingRecommendations();

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Weather Forecast</h1>
                <p className="text-muted-foreground">Mselele, Joska - Real-time conditions</p>
            </div>

            {/* Current Weather Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-xl">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                                    alt={weather.weather[0].description}
                                    className="w-24 h-24"
                                />
                                <div>
                                    <div className="text-6xl font-bold">{Math.round(weather.main.temp)}°C</div>
                                    <p className="text-xl capitalize">{weather.weather[0].description}</p>
                                </div>
                            </div>
                            <div className="text-lg opacity-90">
                                Feels like {Math.round(weather.main.feels_like)}°C
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <CloudSun className="h-32 w-32 opacity-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weather Details Grid */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                        <Droplets className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weather.main.humidity}%</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                        <Wind className="h-4 w-4 text-cyan-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weather.wind.speed} m/s</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visibility</CardTitle>
                        <Eye className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(weather.visibility / 1000).toFixed(1)} km</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pressure</CardTitle>
                        <Gauge className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weather.main.pressure} hPa</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sunrise</CardTitle>
                        <Sunrise className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mounted && weather?.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sunset</CardTitle>
                        <Sunset className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mounted && weather?.sys?.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Farming Recommendations */}
            {recommendations.length > 0 && (
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5" />
                            Farming Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-xl border-l-4 ${rec.type === 'warning' ? 'bg-orange-50 border-l-orange-500' :
                                            rec.type === 'caution' ? 'bg-yellow-50 border-l-yellow-500' :
                                                rec.type === 'success' ? 'bg-green-50 border-l-green-500' :
                                                    'bg-blue-50 border-l-blue-500'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{rec.icon}</div>
                                        <div>
                                            <h4 className="font-semibold mb-1">{rec.title}</h4>
                                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

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
