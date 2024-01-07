const fetchWrapper = (...input) => {
    return new Promise((rs, rj) => {
        fetch(...input)
            .then((response) => {
                if (!response.ok) throw response;
                rs(response);
            })
            .catch((err) => {
                err.json().then((errorMessage) => {
                    rj(errorMessage, err);
                });
            });
    });
};

const pull = (baseUrl, username, password, endPoint, pagingObject, params) => {
    const { paging, pageSize, totalPages, page, filter, order } = pagingObject
        ? pagingObject
        : {};

    endPoint += '?';
    if (filter) {
        endPoint += `${filter}&`;
    }
    if (order) {
        endPoint += `${order}&`;
    }
    if (paging) {
        endPoint += `paging=true&pageSize=${pageSize}&totalPages=${totalPages}&page=${page}&`;
    } else {
        endPoint += 'paging=false&';
    }
    if (params) {
        endPoint += params.join('&');
    }

    return fetchWrapper(baseUrl + endPoint, {
        credentials: 'include',
        headers: {
            Authorization: !username
                ? ''
                : 'Basic ' + btoa(`${username}:${password}`),
        },
    })
        .then((result) => result.json())
        .then((json) => json);
    // .catch((err) => err);
};

const push = (baseUrl, username, password, endPoint, payload, method) => {
    return fetchWrapper(baseUrl + endPoint, {
        method: method ? method : 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            Authorization: !username
                ? ''
                : 'Basic ' + btoa(`${username}:${password}`),
        },
    }).then((result) => {
        return result.json();
    });
    // .catch((err) => {
    //   return err;
    // });
};

export { pull, push };
