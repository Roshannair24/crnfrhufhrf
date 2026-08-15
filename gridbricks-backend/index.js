const express = require("express");
const app = express();
require("dotenv").config()

const port = 3000;

app.use(express.json());

const forecastRouter = require("./api/read/forecast/forecast-router");
const prodRouter = require("./api/read/prod/prod-router");

app.use("/forecast", forecastRouter);
app.use("/prod", prodRouter);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Forecast app listening on port ${port}`);
});
