const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/rent/listing", propertyRoutes);
app.use("/api/v1/rent/user", userRoutes);

module.exports = app;
