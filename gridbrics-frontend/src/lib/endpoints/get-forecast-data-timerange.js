import { getBaseServerUrl } from "../server-config";

async function getForecastDataApi({ payload }) {
  const baseUrl = getBaseServerUrl();

  const queryString = new URLSearchParams(payload).toString();

  return fetch(`${baseUrl}/forecast/data?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
}

export { getForecastDataApi };
