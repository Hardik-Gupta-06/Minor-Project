const express = require("express");
const router = express.Router();
const axios = require("axios");

const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const nlp = require("compromise");

const NEWS_API_KEY = "4f2996417a894f16968b7af21c06edcc";

function analyzeSentiment(articles) {
	const keywords = [
		"crime",
		"safety",
		"threat",
		"violence",
		"accident",
		"theft",
		"protest",
		"murder",
		"flood",
		"earthquake",
		"storm",
	];
	let threatScore = 0;
	let threateningArticles = [];

	articles.forEach((article) => {
		const text = article.title + " " + article.description;
		const sentimentResult = sentiment.analyze(text);

		const doc = nlp(text);
		const keywordMatches = doc.match(keywords.join("|")).out("array").length;

		// Adjust threat score based on sentiment score and keyword count
		threatScore += sentimentResult.score - keywordMatches * 2; // Higher weight to keyword matches

		// Collect articles with negative sentiment or keyword matches for threats
		if (sentimentResult.score < 0 || keywordMatches > 0) {
			threateningArticles.push({
				title: article.title,
				description: article.description,
				url: article.url,
				publishedAt: article.publishedAt,
			});
		}
	});

	return {
		threatScore: threatScore / articles.length, // Average threat score
		threateningArticles, // Only the filtered, threatening articles
	};
}

function classifyThreatLevel(threatScore) {
	if (threatScore < -3) {
		return { level: "High Threat", color: "red" };
	} else if (threatScore >= -3 && threatScore < 1) {
		return { level: "Moderate Threat", color: "yellow" };
	} else {
		return { level: "Low Threat", color: "green" };
	}
}

async function fetchCityNews(city) {
	const url = `https://newsapi.org/v2/everything?q=${city}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
	try {
		const response = await axios.get(url);
		return response.data.articles;
	} catch (error) {
		console.error("Error fetching news:", error);
		return [];
	}
}

router.get("/:city", async (req, res) => {
	// const city = req.params.city;
	// const url = `https://newsapi.org/v2/everything?q=${city} crime safety OR severe weather OR flood OR earthquake OR storm&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

	// try {
	// 	const response = await axios.get(url);
	// 	res.json(response.data.articles);
	// } catch (error) {
	// 	console.error("Error fetching news data:", error);
	// 	res.status(500).json({ message: "Error fetching news data" });
	// }

	const city = req.params.city;
	const articles = await fetchCityNews(city);

	if (articles.length === 0) {
		return res.status(500).json({ message: "Error fetching news data" });
	}

	const { threatScore, threateningArticles } = analyzeSentiment(articles);
	const threatLevel = classifyThreatLevel(threatScore);

	res.json({
		city: city,
		threatLevel: threatLevel.level,
		color: threatLevel.color,
		threateningArticles: threateningArticles.slice(0, 5),
	});
});

module.exports = router;
