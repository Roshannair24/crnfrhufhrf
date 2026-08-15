const { getForecastDataUrl } = require("./constant/elexon-urls");

const getElexonForecastData = async ({ startTime, endTime }) => {
  try {
    if (!startTime) {
      throw new Error("Invalid startTime");
    }
    if (!endTime) {
      throw new Error("Invalid endTime");
    }

    const url = `${getForecastDataUrl()}?publishDateTimeFrom=${startTime}&publishDateTimeTo=${endTime}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    let elexonResponse = null;
    await fetch(url, options)
      .then((response) => response.json())
      .then((data) => (elexonResponse = data))
      .catch((error) => {
        console.error("Error at elexonResponse:", error);
      });

    return elexonResponse ?? [];
  } catch (error) {
    console.log("Error at getElexonForecastData()", error);
    return [];
  }
};

module.exports = {
  getElexonForecastData,
};
