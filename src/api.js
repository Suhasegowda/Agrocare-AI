export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '/api');

export function mediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export function getToken() {
  return localStorage.getItem('agrocare_token');
}

export function saveSession(token) {
  localStorage.setItem('agrocare_token', token);
}

export function clearSession() {
  localStorage.removeItem('agrocare_token');
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, body });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    const message = typeof detail === 'string' ? detail : 'The request could not be completed.';
    throw new Error(message);
  }
  return data;
}
