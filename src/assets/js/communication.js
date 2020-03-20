"use strict";

function fetchFromServer(url, httpVerb, requestBody) {
    let options = {
        method: httpVerb,
        headers: {}
    };
    options.headers["Content-Type"] = "application/json";

    // Don't forget to add data to the body when needed
    options.body = JSON.stringify(requestBody);

    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                console.error('%c%s', 'background-color: red;color: white', '! An error occurred while calling the API');
                console.table(response);
            }
            return response.json();
        })
        .then((jsonresponseyouarelookingfor) => {
            return jsonresponseyouarelookingfor
        })
}

function fetchFromServerWithReturnErrorAndJson(url, httpVerb, requestBody) {
    let options = {
        method: httpVerb,
        headers: {}
    };
    options.headers["Content-Type"] = "application/json";

    // Don't forget to add data to the body when needed
    options.body = JSON.stringify(requestBody);

    return fetch(url, options)
        .then((response) => {
            return response;
        })
}

function fetchWithToken(url, httpVerb, token) {
    return fetch(url, {
            method: httpVerb,
            headers: {
                'Content-type': "application/json",
                'Authorization': 'Bearer ' + token,
            }
        }
    ).then(response => response.json()
    ).then(response => response)
}
