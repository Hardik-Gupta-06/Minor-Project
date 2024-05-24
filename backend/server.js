const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

let DB = process.env.DATABASE_LOCAL;
console.log(DB);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const port = 8000; // or any other port you want to use
app.listen(port, () => {
  console.log("App Running on port: " + port);
});
