import { getBaseServerUrl } from "../server-config";

async function getProdDataApi({ payload }) {
  const baseUrl = getBaseServerUrl();

  const queryString = new URLSearchParams(payload).toString();

  return fetch(`${baseUrl}/prod/data?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
}

export { getProdDataApi };