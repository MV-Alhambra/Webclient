"use strict";

function fetchJSON(url, httpVerb, token, requestBody) {
  return fetchRaw(url, httpVerb, token, requestBody).then(response => response.json());
}

function fetchRaw(url, httpVerb, token, requestBody) {
    return fetch(url, {
            method: httpVerb,
            headers: {
                'Content-type': "application/json",
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(requestBody)
        }
    );
}

