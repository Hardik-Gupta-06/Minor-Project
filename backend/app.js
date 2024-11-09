const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoute");
const weatherRoutes = require("./routes/weatherRoute");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/rent/listing", propertyRoutes);
app.use("/api/v1/rent/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/weather", weatherRoutes);

module.exports = app;
