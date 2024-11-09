const express = require("express");
const router = express.Router();
const axios = require("axios");

const WEATHER_API_KEY = "8815e5ac8c88409a98a123523240911";

async function fetchWeatherForecast(city) {
	const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=5`;
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error("Error fetching weather forecast:", error);
		return null;
	}
}

router.get("/:city", async (req, res) => {
	const city = req.params.city;

	const forecastData = await fetchWeatherForecast(city);

	if (!forecastData) {
		return res.status(500).json({ message: "Error fetching weather data" });
	}

	// Use `forecastData.current` for current weather and `forecastData.forecast.forecastday` for upcoming days
	res.json({
		city: forecastData.location.name,
		currentWeather: forecastData.current,
		forecast: forecastData.forecast,
	});
});

module.exports = router;
