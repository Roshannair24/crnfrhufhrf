const getForecastDataForTimeRange = (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime) {
      throw new Error("Invalid StartTime");
    }

    if (!endTime) {
      throw new Error("Invalid EndTime");
    }

    const data = {};

    res.status(200).json({ ok: true, data });
  } catch (error) {
    console.log("Error at getForecastDataForTimeRange():", error);
    res.status(400).json({ error: error?.message });
  }
};

module.exports = {
  getForecastDataForTimeRange,
};
