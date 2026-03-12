import axios from "axios";

export const TOKEN_KEY = "thinkboard_token";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const normalizedBaseUrl = trimmedBaseUrl.endsWith("/api")
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
