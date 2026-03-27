var BASE_URL = 'http://127.0.0.1:3000/api';

function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
}

function apiFetch(path, options) {
    return fetch(BASE_URL + path, options).then(function(response) {
        return response.json().then(function(data) {
            return { status: response.status, data: data };
        });
    });
}
