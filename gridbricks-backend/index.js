const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const forecastRouter = require("./api/read/forecast/forecast-router");
const prodRouter = require("./api/read/prod/prod-router");

app.use("/forecast", forecastRouter);
app.use("/prod", prodRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Forecast app listening on port ${port}`);
  });
}
