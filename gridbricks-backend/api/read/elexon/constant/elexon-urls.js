const ELEXON_BASE_URL = process.env.ELEXON_BASE_URL;

const ELEXON_API_URLS = {
  GET_FORECAST_DATA: `${ELEXON_BASE_URL}/bmrs/api/v1/datasets/WINDFOR/stream`,
};

function getForecastDataUrl() {
  return ELEXON_API_URLS.GET_FORECAST_DATA;
}

module.exports = {
  getForecastDataUrl,
};
