import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5102/api/v1",
});

export function authHeaders() {
  return {
    headers: {
      token: localStorage.getItem("userToken"),
    },
  };
}

export default api;
