import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://eshop-project-react.onrender.com/api",
  withCredentials: true,
});
