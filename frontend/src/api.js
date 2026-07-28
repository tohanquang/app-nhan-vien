import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Trỏ tới Django backend
});

// Tự động đính kèm Access Token vào mọi request gửi đi
api.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (kiểm tra lại xem key lưu lúc login là 'accessToken' hay 'access')
        const token = localStorage.getItem('access_token'); 
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