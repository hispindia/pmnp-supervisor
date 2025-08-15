class SessionManager {
  constructor() {
    this.session = null;
    this.isAuthenticated = false;
    this.baseUrl = "";
    this.username = "";
    this.password = "";
  }

  // Initialize session with credentials
  async initialize(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;

    try {
      // Create initial session by making an authenticated request
      await this.authenticate();
      return true;
    } catch (error) {
      console.error("Session initialization failed:", error);
      return false;
    }
  }

  // Authenticate and establish session
  async authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/api/me`, {
        method: "GET",
        credentials: "include", // This will include cookies for session management
        headers: {
          Authorization: "Basic " + btoa(`${this.username}:${this.password}`),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        this.isAuthenticated = true;
        console.log("Session established successfully");
        return true;
      } else {
        throw new Error(`Authentication failed: ${response.status}`);
      }
    } catch (error) {
      this.isAuthenticated = false;
      throw error;
    }
  }

  // Make authenticated request using session
  async request(endpoint, options = {}) {
    if (!this.isAuthenticated) {
      throw new Error("Session not authenticated. Please call authenticate() first.");
    }

    const requestOptions = {
      credentials: "include", // Use session cookies
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);

      // If we get 401, session may have expired, try to re-authenticate
      if (response.status === 401) {
        console.log("Session expired, attempting to re-authenticate...");
        await this.authenticate();

        // Retry the request with fresh session
        return await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
      }

      return response;
    } catch (error) {
      console.error("Session request failed:", error);
      throw error;
    }
  }

  // GET request using session
  async get(endpoint, pagingObject = {}, params = []) {
    const { paging, pageSize, totalPages, page, filter, order, skipPaging = false } = pagingObject;

    let queryString = "?";
    if (filter) queryString += `${filter}&`;
    if (order) queryString += `${order}&`;

    if (paging) {
      queryString += `paging=true&pageSize=${pageSize}&page=${page}&`;
      if (totalPages) queryString += `totalPages=${totalPages}&`;
    } else {
      queryString += "paging=false&";
    }

    if (params && params.length > 0) {
      queryString += params.join("&");
    }

    if (skipPaging) {
      queryString += "&skipPaging=true";
    }

    const response = await this.request(`${endpoint}${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // POST request using session
  async post(endpoint, payload, method = "POST") {
    const response = await this.request(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`${method} request failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Invalid content type, expected application/json");
    }
  }

  // PUT request using session
  async put(endpoint, payload) {
    return await this.post(endpoint, payload, "PUT");
  }

  // DELETE request using session
  async delete(endpoint) {
    const response = await this.request(endpoint, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  // Pure push (for different content types)
  async purePush(endpoint, payload, method = "POST", headers = {}) {
    const response = await this.request(endpoint, {
      method,
      body: payload,
      headers: {
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`${method} request failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Invalid content type, expected application/json");
    }
  }

  // Clear session
  logout() {
    this.isAuthenticated = false;
    this.session = null;
    this.username = "";
    this.password = "";
    console.log("Session cleared");
  }

  // Check if session is valid
  isSessionValid() {
    return this.isAuthenticated;
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;
