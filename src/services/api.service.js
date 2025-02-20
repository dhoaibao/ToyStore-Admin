import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL;

const createApiClient = (path) => {
  const api = axios.create({
    baseURL: `${baseURL}${path}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor to add the Authorization header
  api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log('Error:', error.response);
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem('refreshToken');

      if (
        error.response &&
        error.response.data.message === 'Token has expired' &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken: refreshToken,
          });

          // console.log('Làm mới token thành công:', response.data.token);

          const newAccessToken = response.data.token.accessToken;
          const newRefreshToken = response.data.token.refreshToken;

          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          if (
            refreshError.response &&
            refreshError.response.data.message === 'Token has expired'
          ) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;