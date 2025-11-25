const asyncHandler = require('express-async-handler');
const axios = require('axios');

// @desc    Get current weather for Joska, Kenya
// @route   GET /api/weather
// @access  Private
const getWeather = asyncHandler(async (req, res) => {
    // Joska coordinates: -1.2833, 37.0833 (Approx)
    const lat = -1.2833;
    const lon = 37.0833;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        // Mock data if no API key
        return res.json({
            coord: { lon: 37.0833, lat: -1.2833 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            main: {
                temp: 25.5,
                feels_like: 26.0,
                temp_min: 24.0,
                temp_max: 27.0,
                pressure: 1015,
                humidity: 50,
            },
            wind: { speed: 3.5, deg: 120 },
            visibility: 10000,
            sys: {
                sunrise: 1637730000,
                sunset: 1637773200,
            },
            name: 'Joska',
            mock: true,
        });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        // Return mock data on failure to avoid 500 errors in dev
        return res.json({
            coord: { lon: 37.0833, lat: -1.2833 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            main: {
                temp: 25.5,
                feels_like: 26.0,
                temp_min: 24.0,
                temp_max: 27.0,
                pressure: 1015,
                humidity: 50,
            },
            wind: { speed: 3.5, deg: 120 },
            visibility: 10000,
            sys: {
                sunrise: 1637730000,
                sunset: 1637773200,
            },
            name: 'Joska',
            mock: true,
        });
    }
});

module.exports = {
    getWeather,
};
