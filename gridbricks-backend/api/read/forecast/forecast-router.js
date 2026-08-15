const express = require("express");
const { getForecastDataForTimeRange } = require("./forecast-service");
const forecastRouter = express.Router();

forecastRouter.get("/data", getForecastDataForTimeRange);

module.exports = forecastRouter;
