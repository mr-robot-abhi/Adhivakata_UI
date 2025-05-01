// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization token if available
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return null
      }
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

export default {
  // Auth endpoints
  auth: {
    login: (credentials) =>
      fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    register: (userData) =>
      fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    logout: () =>
      fetchAPI("/auth/logout", {
        method: "POST",
      }),

    verifyToken: () => fetchAPI("/auth/verify"),
  },

  // Cases endpoints
  cases: {
    getAll: (filters = {}) => fetchAPI("/cases?" + new URLSearchParams(filters)),

    getById: (id) => fetchAPI(`/cases/${id}`),

    create: (caseData) =>
      fetchAPI("/cases", {
        method: "POST",
        body: JSON.stringify(caseData),
      }),

    update: (id, caseData) =>
      fetchAPI(`/cases/${id}`, {
        method: "PUT",
        body: JSON.stringify(caseData),
      }),

    delete: (id) =>
      fetchAPI(`/cases/${id}`, {
        method: "DELETE",
      }),
  },

  // Documents endpoints
  documents: {
    getAll: (filters = {}) => fetchAPI("/documents?" + new URLSearchParams(filters)),

    getById: (id) => fetchAPI(`/documents/${id}`),

    upload: (formData) =>
      fetchAPI("/documents/upload", {
        method: "POST",
        headers: {}, // Let the browser set the content type for form data
        body: formData,
      }),

    update: (id, documentData) =>
      fetchAPI(`/documents/${id}`, {
        method: "PUT",
        body: JSON.stringify(documentData),
      }),

    delete: (id) =>
      fetchAPI(`/documents/${id}`, {
        method: "DELETE",
      }),
  },

  // Calendar/Events endpoints
  events: {
    getAll: (filters = {}) => fetchAPI("/events?" + new URLSearchParams(filters)),

    getById: (id) => fetchAPI(`/events/${id}`),

    create: (eventData) =>
      fetchAPI("/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      }),

    update: (id, eventData) =>
      fetchAPI(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
      }),

    delete: (id) =>
      fetchAPI(`/events/${id}`, {
        method: "DELETE",
      }),
  },

  // User/Profile endpoints
  users: {
    getProfile: () => fetchAPI("/users/profile"),

    updateProfile: (profileData) =>
      fetchAPI("/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),

    changePassword: (passwordData) =>
      fetchAPI("/users/change-password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      }),
  },

  // Dashboard data
  dashboard: {
    getSummary: () => fetchAPI("/dashboard/summary"),

    getRecentCases: () => fetchAPI("/dashboard/recent-cases"),

    getUpcomingEvents: () => fetchAPI("/dashboard/upcoming-events"),
  },

  // Support endpoints
  support: {
    contact: (formData) =>
      fetchAPI("/support/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      }),
  },
}
