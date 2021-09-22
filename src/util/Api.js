import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://api.propublica.org/congress/v1/",
  headers: {
    "X-API-Key": "d0ywBucVrXRlMQhENZxRtL3O7NPgtou2mwnLARTr",
  },
});
