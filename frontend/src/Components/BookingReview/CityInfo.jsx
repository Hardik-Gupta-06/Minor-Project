import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../CSS/CityInfo.css";

const CityInfo = ({ city }) => {
	const [weather, setWeather] = useState(null);
	const [threatInfo, setThreatInfo] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCityData = async () => {
			try {
				const [weatherResponse, threatResponse] = await Promise.all([
					axios.get(`/api/weather/${city}`),
					axios.get(`/api/news/${city}`),
				]);

				setWeather(weatherResponse.data);
				setThreatInfo(threatResponse.data);
			} catch (error) {
				console.error("Error fetching city data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCityData();
	}, [city]);

	if (loading) return <div>Loading city information...</div>;

	return (
		<div className="city-info">
			{threatInfo ? (
				<div
					className="threat-level"
					style={{
						color: threatInfo.color === "yellow" ? "#afc506" : threatInfo.color,
					}}
				>
					<h3>Threat Level: {threatInfo.threatLevel}</h3>
					<ul>
						{threatInfo.threateningArticles &&
						threatInfo.threateningArticles.length > 0 ? (
							threatInfo.threateningArticles.map((article, index) => (
								<li key={index}>
									<a
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{article.title}
									</a>
								</li>
							))
						) : (
							<li>No news available</li>
						)}
					</ul>
				</div>
			) : (
				<div>Unable to fetch threat info</div>
			)}

			{weather ? (
				<div className="weather-info">
					<h3>
						Current Weather in {city.charAt(0).toUpperCase() + city.slice(1)}
					</h3>
					<p>{weather.currentWeather.condition.text}</p>
					<img src={weather.currentWeather.condition.icon} alt="Weather Icon" />
					<p>Temperature: {weather.currentWeather.temp_c}°C</p>
					<p>Feels Like: {weather.currentWeather.feelslike_c}°C</p>
					<h4>Forecast</h4>
					<ul>
						{weather.forecast.forecastday &&
						weather.forecast.forecastday.length > 0 ? (
							weather.forecast.forecastday.map((day, index) => (
								<li key={index}>
									<strong>{day.date}:</strong> {day.day.condition.text}, Max:{" "}
									{day.day.maxtemp_c}°C, Min: {day.day.mintemp_c}°C
								</li>
							))
						) : (
							<li>No forecast data available</li>
						)}
					</ul>
				</div>
			) : (
				<div>Unable to fetch weather data</div>
			)}
		</div>
	);
};

export default CityInfo;
