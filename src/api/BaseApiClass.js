import { pull, purePush } from "./Fetch";

export default class BaseApiClass {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl ? baseUrl : "../../..";
    this.username = username ? username : "";
    this.password = password ? password : "";
    this.useSession = false; // Flag to determine whether to use session or basic auth
  }

  // GET method - can use either session or basic auth
  get = async (endPoint, paging, params) => {
    return pull(this.baseUrl, this.username, this.password, endPoint, paging, params);
  };

  // Pure push method - can use either session or basic auth
  purePush = async (endPoint, payload, method) => {
    return purePush(this.baseUrl, this.username, this.password, endPoint, payload, method);
  };

  // POST method using session
  post = async (endPoint, payload, method = "POST") => {
    return purePush(this.baseUrl, this.username, this.password, endPoint, JSON.stringify(payload), method, {
      "Content-Type": "application/json",
    });
  };

  // PUT method using session
  put = async (endPoint, payload) => {
    return await this.post(endPoint, payload, "PUT");
  };
}
