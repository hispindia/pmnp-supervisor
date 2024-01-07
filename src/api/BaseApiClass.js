import { pull } from './Fetch';

export default class BaseApiClass {
    constructor(baseUrl, username, password) {
        this.baseUrl = baseUrl ? baseUrl : '../../..';
        this.username = username ? username : '';
        this.password = password ? password : '';
    }

    get = (endPoint, paging, params) =>
        pull(
            this.baseUrl,
            this.username,
            this.password,
            endPoint,
            paging,
            params
        );
}
