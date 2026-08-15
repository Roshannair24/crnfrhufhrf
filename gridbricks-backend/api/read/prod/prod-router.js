const express = require("express");
const { getProdDataForTimeRange } = require("./prod-service");
const prodRouter = express.Router();

prodRouter.get("/data", getProdDataForTimeRange);

module.exports = prodRouter;
