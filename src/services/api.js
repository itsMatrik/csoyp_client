import axios from 'axios';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с настройками по умолчанию
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления JWT токена к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер ответил с статусом ошибки
      switch (error.response.status) {
        case 401:
          // Unauthorized - удаляем токен и перенаправляем на логин
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Доступ запрещен');
          break;
        case 404:
          // Not Found
          console.error('Ресурс не найден');
          break;
        case 500:
          // Server Error
          console.error('Ошибка сервера');
          break;
        default:
          console.error('Произошла ошибка:', error.response.status);
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Нет ответа от сервера');
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Ошибка настройки запроса:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Вспомогательные функции для API
export const apiHelper = {
  // Преобразование данных для отправки
  sanitizeData: (data) => {
    const sanitized = { ...data };
    // Удаляем пустые поля
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === '' || sanitized[key] == null) {
        delete sanitized[key];
      }
    });
    return sanitized;
  },

  // Обработка ошибок
  handleError: (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    return 'Произошла непредвиденная ошибка';
  }
};

export default api;