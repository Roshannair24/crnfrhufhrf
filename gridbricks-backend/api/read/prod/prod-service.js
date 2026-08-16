const { getElexonProdData } = require("../elexon/elexon-helpers");

const getProdDataForTimeRange = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime) {
      throw new Error("Invalid StartTime");
    }

    if (!endTime) {
      throw new Error("Invalid EndTime");
    }

    const data = await getElexonProdData({
      startTime,
      endTime,
    });

    res.status(200).json({ ok: true, data });
  } catch (error) {
    console.log("Error at getProdDataForTimeRange()", error);
    res.status(400).json({ error: error?.message });
  }
};

module.exports = {
  getProdDataForTimeRange,
};
