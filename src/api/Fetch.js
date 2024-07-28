// const fetchWrapper = (...input) => {
//   return new Promise((rs, rj) => {
//     fetch(...input)
//       .then((response) => {
//         if (!response.ok) throw response;
//         rs(response);
//       })
//       .catch((err) => {
//         console.log({ err });
//         rj(err);
//       });
//   });
// };

const fetchWrapper = (...input) => {
  return new Promise((rs, rj) => {
    fetch(...input)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          }
          throw response;
        }

        rs(response);
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "Unauthorized") {
          alert("Session expired. Please login again.");
          window.location.href =
            "../../../dhis-web-commons-security/logout.action";
        }
        rj(err);
      });
  });
};

const pull = (baseUrl, username, password, endPoint, pagingObject, params) => {
  const {
    paging,
    pageSize,
    totalPages,
    page,
    filter,
    order,
    skipPaging = false,
  } = pagingObject ? pagingObject : {};

  endPoint += "?";
  if (filter) {
    endPoint += `${filter}&`;
  }
  if (order) {
    endPoint += `${order}&`;
  }
  if (paging) {
    endPoint += `paging=true&pageSize=${pageSize}&page=${page}&`;
    if (totalPages) {
      endPoint += `totalPages=${totalPages}&`;
    }
  } else {
    endPoint += "paging=false&";
  }

  if (params) {
    endPoint += params.join("&");
  }

  if (skipPaging) {
    endPoint += "&skipPaging=true";
  }

  return fetchWrapper(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username
        ? ""
        : "Basic " + btoa(`${username}:${password}`),
    },
  })
    .then((result) => result.json())
    .then((json) => json);
  // .catch((err) => err);
};

const push = (baseUrl, username, password, endPoint, payload, method) => {
  return fetchWrapper(baseUrl + endPoint, {
    method: method ? method : "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: !username
        ? ""
        : "Basic " + btoa(`${username}:${password}`),
    },
  }).then((result) => {
    if (result.headers.get("content-type").includes("application/json")) {
      return result.json().then((res) => {
        return res;
      });
    } else {
      alert("Session expired. Please login again.");
      window.location.href = "../../../dhis-web-commons-security/logout.action";
      throw new Error("Invalid content type, expected application/json");
    }
  });
  // .catch((err) => {
  //   return err;
  // });
};

export { pull, push };
