import axios from "axios";

export const TOKEN_KEY = "thinkboard_token";

const api = axios.create({
  baseURL: "http://localhost:5001/api", 
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
