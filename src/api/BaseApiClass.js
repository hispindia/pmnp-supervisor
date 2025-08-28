import { pull, purePush } from "./Fetch";
import sessionManager from "./SessionManager";

export default class BaseApiClass {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl ? baseUrl : "../../..";
    this.username = username ? username : "";
    this.password = password ? password : "";
    this.useSession = false; // Flag to determine whether to use session or basic auth
  }

  // Initialize session-based authentication
  async initializeSession() {
    const success = await sessionManager.initialize(this.baseUrl, this.username, this.password);
    // skip this
    this.useSession = false;
    return success;
  }

  // GET method - can use either session or basic auth
  get = async (endPoint, paging, params) => {
    if (this.useSession && sessionManager.isSessionValid()) {
      return await sessionManager.get(endPoint, paging, params);
    } else {
      return pull(this.baseUrl, this.username, this.password, endPoint, paging, params);
    }
  };

  // Pure push method - can use either session or basic auth
  purePush = async (endPoint, payload, method) => {
    console.log("sessionManager", sessionManager.isSessionValid());
    if (this.useSession && sessionManager.isSessionValid()) {
      return await sessionManager.purePush(endPoint, payload, method);
    } else {
      return purePush(this.baseUrl, this.username, this.password, endPoint, payload, method);
    }
  };

  // POST method using session
  post = async (endPoint, payload, method = "POST") => {
    console.log("sessionManager", sessionManager.isSessionValid());
    if (this.useSession && sessionManager.isSessionValid()) {
      return await sessionManager.post(endPoint, payload, method);
    } else {
      return purePush(this.baseUrl, this.username, this.password, endPoint, JSON.stringify(payload), method, {
        "Content-Type": "application/json",
      });
    }
  };

  // PUT method using session
  put = async (endPoint, payload) => {
    return await this.post(endPoint, payload, "PUT");
  };

  // DELETE method using session
  delete = async (endPoint) => {
    if (this.useSession && sessionManager.isSessionValid()) {
      return await sessionManager.delete(endPoint);
    } else {
      return purePush(this.baseUrl, this.username, this.password, endPoint, null, "DELETE");
    }
  };

  // Switch to session-based authentication
  enableSessionMode = async () => {
    const success = await this.initializeSession();
    return success;
  };

  // Switch back to basic auth
  disableSessionMode = () => {
    this.useSession = false;
    sessionManager.logout();
  };

  // Check if using session mode
  isUsingSession = () => {
    return this.useSession && sessionManager.isSessionValid();
  };
}
