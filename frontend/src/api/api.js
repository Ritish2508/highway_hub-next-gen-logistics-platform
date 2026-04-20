// // src/api/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api/v1", // backend URL
// });

// // request interceptor → token attach
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// ✅ Request interceptor → token attach
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // force logout
    }
    return Promise.reject(error);
  }
);

export default api;
