import axios from "axios";

const api = axios.create({
  baseURL: "https://schoolassistant-neon.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth_data") || "{}");

  if (auth.access) {
    config.headers.Authorization = `Bearer ${auth.access}`;
  }

  return config;
});

export default api;