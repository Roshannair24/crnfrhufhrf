const ELEXON_BASE_URL = process.env.ELEXON_BASE_URL;

const ELEXON_API_URLS = {
  GET_FORECAST_DATA: `${ELEXON_BASE_URL}/bmrs/api/v1/datasets/WINDFOR/stream`,
  GET_PROD_DATA: `${ELEXON_BASE_URL}/bmrs/api/v1/datasets/FUELHH/stream`,
};

function getForecastDataUrl() {
  return ELEXON_API_URLS.GET_FORECAST_DATA;
}

function getProdDataUrl() {
  return ELEXON_API_URLS.GET_PROD_DATA;
}

module.exports = {
  getForecastDataUrl,
  getProdDataUrl,
};
