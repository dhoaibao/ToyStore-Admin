const baseURL = import.meta.env.VITE_APP_API_URL;

const createApiClient = (path) => {
  const getHeaders = (options = {}, token) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const headers = options.body instanceof FormData
      ? {}
      : defaultHeaders;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const refreshToken = async (currentRefreshToken) => {
    const response = await fetch(`${baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!response.ok) throw new Error('Refresh token failed');

    const { token } = await response.json();
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('refreshToken', token.refreshToken);
    return token.accessToken;
  };

  const apiFetch = async (endpoint, options = {}) => {
    const url = `${baseURL}${path}${endpoint}`;
    const headers = getHeaders(options, localStorage.getItem('accessToken'));
    const body = options.body instanceof FormData
      ? options.body
      : options.body ? JSON.stringify(options.body) : undefined;

    let response = await fetch(url, { ...options, headers, body });

    if (!response.ok) {
      const errorData = await response.json();
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (errorData.message === 'Token has expired' && refreshTokenValue && !options._retry) {
        try {
          const newAccessToken = await refreshToken(refreshTokenValue);
          const retryHeaders = getHeaders(options, newAccessToken);
          response = await fetch(url, { ...options, headers: retryHeaders, body });
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
          throw refreshError;
        }
      }

      if (!response.ok) {
        throw new Error(errorData.message || 'API request failed');
      }
    }

    return response;
  };

  return {
    get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
    post: (endpoint, body, config) => apiFetch(endpoint, { method: 'POST', body, ...config }),
    put: (endpoint, body, config) => apiFetch(endpoint, { method: 'PUT', body, ...config }),
    delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
  };
};

export default createApiClient;