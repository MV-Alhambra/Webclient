"use strict";

const happyValidator ="application/json";

function fetchFromServer(url, httpVerb, requestBody) {
    const options = {
        method: httpVerb,
        headers: {
            'Content-Type': happyValidator
        },
        body: JSON.stringify(requestBody)

    };
    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                console.error('%c%s', 'background-color: red;color: white', '! An error occurred while calling the API');
                console.table(response);
            }
            return response.json();
        })
        .then((jsonresponseyouarelookingfor) => {
            return jsonresponseyouarelookingfor;
        });
}

function fetchFromServerWithReturnErrorAndJson(url, httpVerb, requestBody) {
    const options = {
        method: httpVerb,
        headers: {
            'Content-Type': happyValidator
        },
        body: JSON.stringify(requestBody)
    };

    return fetch(url, options)
        .then((response) => {
            return response;
        });
}

function fetchWithToken(url, httpVerb, token, requestBody) {
    return fetch(url, {
            method: httpVerb,
            headers: {
                'Content-type': happyValidator,
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(requestBody)
        }
    ).then(response => response.json()
    ).then(response => response);
}
