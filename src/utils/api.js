const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set user in localStorage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = () => {
  localStorage.removeItem('user');
};

// Fetch wrapper with auth
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API methods
export const api = {
  // Auth
  register: async (userData) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  logout: () => {
    removeToken();
    removeUser();
  },

  // Media
  requestUpload: async (mediaData) => {
    return fetchAPI('/media/request-upload', {
      method: 'POST',
      body: JSON.stringify(mediaData),
    });
  },

  uploadToBlob: async (sasUrl, file) => {
    const response = await fetch(sasUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response;
  },

  createMedia: async (mediaData) => {
    return fetchAPI('/media', {
      method: 'POST',
      body: JSON.stringify(mediaData),
    });
  },

  getMedia: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/media${queryString ? `?${queryString}` : ''}`);
  },

  getMediaById: async (id, artistId) => {
    return fetchAPI(`/media/${id}?artistId=${artistId}`);
  },

  updateMedia: async (id, updates) => {
    return fetchAPI(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteMedia: async (id) => {
    return fetchAPI(`/media/${id}`, {
      method: 'DELETE',
    });
  },

  // Users
  getUser: async (id) => {
    return fetchAPI(`/users/${id}`);
  },

  // Discovery
  search: async (query) => {
    return fetchAPI(`/discovery/search?q=${encodeURIComponent(query)}`);
  },

  getTrending: async () => {
    return fetchAPI('/discovery/trending');
  },

  // Moderation
  flagContent: async (mediaId, reason) => {
    return fetchAPI('/moderation/flag', {
      method: 'POST',
      body: JSON.stringify({ mediaId, reason }),
    });
  },

  // Helpers
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  removeUser,
};

