import { getForecastDataApi } from "./endpoints/get-forecast-data-timerange";
import { getProdDataApi } from "./endpoints/get-prod-data-timerange";

const PING = {
  getForecastDataApi,
  getProdDataApi,
};

export default PING;
