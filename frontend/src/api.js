import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "https://e89006ca-f8ef-4a3f-8d90-f6a7f1445475-dev.e1-us-east-azure.choreoapis.dev/django-react-full-stack-a/backend/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {  
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;