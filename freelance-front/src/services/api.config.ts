import axios from "axios";
import APP_ENV from "../env";

// Створюємо екземпляр axios з базовою конфігурацією
export const api = axios.create({
  baseURL: APP_ENV.API_URL || "http://localhost:5126",
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо interceptor для автоматичного додавання токену
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Видаляємо токен і перенаправляємо на логін
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
