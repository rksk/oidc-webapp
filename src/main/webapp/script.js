var configParams = [];
var code;
var access_token;
var id_token;
var refresh_token;
var redirectUri;
var message = "";

redirectUri = window.location.href.split('?')[0];
redirectUri = redirectUri.split('#')[0];
var bffEndpoint = redirectUri + "bff";

var configParamsElement = document.getElementById("configParams");
function registerInput(name, defaultValue, readOnly) {
    var value = "";
    if (getCookie(name) != null) {
        value = getCookie(name);
    } else if (defaultValue) {
        value = defaultValue;
    }
    var inputHtmlElem = '<label for="' + name + '">' + name + ':</label>';
    inputHtmlElem += '<input type="text" class="form-control" id="' + name + '" value="' + value + '" ';
    if (readOnly) {
        inputHtmlElem += 'disabled />';
    } else {
        inputHtmlElem += 'onchange="setConfigParam(this.id, this.value)" />';
    }
    configParamsElement.innerHTML += inputHtmlElem;
    configParams[name] = value;
    configParams[name] = value;
}

function registerSelect(name, options, defaultValue) {
    var value = defaultValue;
    if (getCookie(name) != null) {
        value = getCookie(name);
    }

    var inputHtmlElem = '<label for="' + name + '">' + name + ':</label>';
    inputHtmlElem += '<select class="form-control" id="' + name + '" onchange="setConfigParam(this.id, this.value)">';
    for (var i = 0; i < options.length; i++) {
        var selected = (options[i] === value) ? "selected" : "";
        inputHtmlElem += '<option value="' + options[i] + '" ' + selected + '>' + options[i] + '</option>';
    }
    inputHtmlElem += '</select>';

    configParamsElement.innerHTML += inputHtmlElem;
    configParams[name] = value;
}

function setConfigParam(name, value) {
    configParams[name] = value;
    setCookie(name, value);
    if (name === 'grantType') {
        updateVisibility();
        updateButtons();
    }
}

function updateVisibility() {
    var grantType = configParams['grantType'];
    var common = ['clientId', 'clientSecret', 'tokenEndpoint', 'revokeEndpoint', 'introspectEndpoint', 'grantType'];
    var authCode = ['scope', 'responseType', 'additionalParams', 'enablePkce', 'authorizeEndpoint', 'logoutEndpoint', 'redirectUri'];
    var cc = ['scope'];
    var password = ['username', 'password', 'scope'];

    // Helper to show/hide
    var show = function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.style.display = 'block';
            if (el.previousElementSibling && el.previousElementSibling.tagName === 'LABEL') {
                el.previousElementSibling.style.display = 'block';
            }
            // For checkbox which is wrapped in a div.form-check
            if (el.parentElement.classList.contains('form-check')) {
                el.parentElement.style.display = 'block';
            }
        }
    };
    var hide = function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            if (el.previousElementSibling && el.previousElementSibling.tagName === 'LABEL') {
                el.previousElementSibling.style.display = 'none';
            }
            if (el.parentElement.classList.contains('form-check')) {
                el.parentElement.style.display = 'none';
            }
        }
    };

    var allFields = ['clientId', 'clientSecret', 'scope', 'responseType', 'additionalParams', 'enablePkce', 'authorizeEndpoint', 'tokenEndpoint', 'logoutEndpoint', 'revokeEndpoint', 'introspectEndpoint', 'redirectUri', 'username', 'password'];

    allFields.forEach(hide);

    common.forEach(show);

    if (grantType === 'authorization_code') {
        authCode.forEach(show);
        document.getElementById("startButton").textContent = "Start OAuth Flow";
    } else {
        if (grantType === 'client_credentials') {
            cc.forEach(show);
        } else if (grantType === 'password') {
            password.forEach(show);
        }
        document.getElementById("startButton").textContent = "Request Access Token";
    }
}

function registerCheckbox(name, defaultValue) {
    var value = defaultValue;
    if (getCookie(name) != null) {
        value = getCookie(name) === 'true';
    }

    var checked = value ? "checked" : "";

    var inputHtmlElem = '<div class="form-check">';
    inputHtmlElem += '<input class="form-check-input" type="checkbox" id="' + name + '" ' + checked + ' onchange="setConfigParam(this.id, this.checked)">';
    inputHtmlElem += '<label class="form-check-label" for="' + name + '">' + name + '</label>';
    inputHtmlElem += '</div>';

    configParamsElement.innerHTML += inputHtmlElem;
    configParams[name] = value;
}

registerSelect("grantType", ["authorization_code", "client_credentials", "password"], "authorization_code");
registerInput("clientId", "");
registerInput("clientSecret", "");
registerInput("username", "");
registerInput("password", "");
registerInput("scope", "openid");
registerInput("responseType", "code");
registerInput("additionalParams", "");
registerCheckbox("enablePkce", false);
registerInput("authorizeEndpoint", "https://localhost:9443/oauth2/authorize");
registerInput("tokenEndpoint", "https://localhost:9443/oauth2/token");
registerInput("logoutEndpoint", "https://localhost:9443/oidc/logout");
registerInput("revokeEndpoint", "https://localhost:9443/oauth2/revoke");
registerInput("introspectEndpoint", "https://localhost:9443/oauth2/introspect");
registerInput("redirectUri", redirectUri, true);

updateVisibility();

//if (getCookie('showhideconfigs') && getCookie('showhideconfigs')=='none') {
//    document.getElementById('configParams').style.display = 'none';
//    document.getElementById("showhideconfigs").textContent = "Show Configs";
//}

var handleXhrResponse = function (xhr, clear_content) {

    if (clear_content) {
        message = "";
    }
    var response = xhr.response;
    if (xhr.status == 200) {
        if (response.access_token) {
            access_token = response.access_token;
            message += "Access Token: ";
            if (response.access_token.includes(".")) {
                message += "<pre>" + JSON.stringify(parseJwt(access_token), null, 4) + "</pre>";
            } else {
                message += "<pre>" + access_token + "</pre>";
            }
        }

        if (response.id_token) {
            id_token = response.id_token;
            message += "ID Token: ";
            message += "<pre>" + JSON.stringify(parseJwt(response.id_token), null, 4) + "</pre>";
        }

        if (response.refresh_token) {
            refresh_token = response.refresh_token;
            message += "Refresh Token: <pre>" + response.refresh_token + "</pre>";
        }

        message += "Token Response: <pre>" + JSON.stringify(response, null, 4) + "</pre>";
    }
    else {
        message = +"Error: " + response.error_description + " (" + response.error + ")";
    }

    document.getElementById("result").innerHTML = message;
    updateButtons();
};


if (window.location.search) {
    var args = new URLSearchParams(window.location.search);
}
var hashParams = getHashParams();


if (args && args.get("error")) {
    message = "Error: <pre>";
    for (const [key, value] of args) {
        message += key + "=" + value + "\n";
    }
    message += "</pre>";
    document.getElementById("result").innerHTML = message;
}

if (args) {
    code = args.get("code");
}
if (!code && hashParams["code"]) {
    code = hashParams["code"];
}

if (code) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        handleXhrResponse(this, false);
    };
    xhr.responseType = 'json';
    xhr.open("POST", bffEndpoint, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    var tokenParams = {
        client_id: configParams['clientId'],
        client_secret: configParams['clientSecret'],
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
        endpoint: configParams['tokenEndpoint']
    };

    var codeVerifier = window.sessionStorage.getItem("code_verifier");
    if (codeVerifier) {
        tokenParams['code_verifier'] = codeVerifier;
        window.sessionStorage.removeItem("code_verifier");
    }

    xhr.send(new URLSearchParams(tokenParams));
}

if (hashParams["access_token"]) {
    access_token = hashParams["access_token"];
    message += "Access Token (Hybrid flow): ";
    if (access_token.includes(".")) {
        message += "<pre>" + JSON.stringify(parseJwt(access_token), null, 4) + "</pre>";
    }
    message += "<pre>" + access_token + "</pre>";
    document.getElementById("result").innerHTML = message;
}

var hashParams = getHashParams();
if (hashParams["id_token"]) {
    id_token = hashParams["id_token"];
    message += "ID Token (Hybrid flow): ";
    message += "<pre>" + JSON.stringify(parseJwt(id_token), null, 4) + "</pre>";
    document.getElementById("result").innerHTML = message;
}

updateButtons();

function updateButtons() {
    var grantType = configParams['grantType'];
    if ((id_token || access_token || code) && grantType === 'authorization_code') {
        document.getElementById('logoutButton').style.display = 'inline';
    } else {
        document.getElementById('logoutButton').style.display = 'none';
    }
    if (access_token) {
        document.getElementById('revokeButton').style.display = 'inline';
        document.getElementById('introspectButton').style.display = 'inline';
    }
    if (refresh_token) {
        document.getElementById('refreshButton').style.display = 'inline';
    }
};

document.getElementById("startButton").onclick = function () {
    var grantType = configParams['grantType'];

    if (grantType === 'client_credentials' || grantType === 'password') {
        var params = {
            client_id: configParams['clientId'],
            client_secret: configParams['clientSecret'],
            grant_type: grantType,
            endpoint: configParams['tokenEndpoint'],
            scope: configParams['scope']
        };

        if (grantType === 'password') {
            params['username'] = configParams['username'];
            params['password'] = configParams['password'];
        }

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            handleXhrResponse(this, true);
        };
        xhr.responseType = 'json';
        xhr.open("POST", bffEndpoint, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(new URLSearchParams(params));

        return;
    }

    var enablePkce = configParams['enablePkce'];

    var codeVerifier = generateRandomString(64);
    var state = generateRandomString(10);
    const challengeMethod = crypto.subtle ? "S256" : "plain"

    if (configParams['responseType'].includes("id_token") &&
        !configParams['additionalParams'].includes("nonce=")) {
        configParams['additionalParams'] += "&nonce=" + generateRandomString(10);
    }

    Promise.resolve()
        .then(() => {
            if (enablePkce) {
                if (challengeMethod === 'S256') {
                    return generateCodeChallenge(codeVerifier)
                } else {
                    return codeVerifier
                }
            }
            return null;
        })
        .then(function (codeChallenge) {

            var args = new URLSearchParams({
                response_type: configParams['responseType'],
                client_id: configParams['clientId'],
                redirect_uri: redirectUri,
                scope: configParams['scope'],
                state: state
            });

            if (codeChallenge) {
                window.sessionStorage.setItem("code_verifier", codeVerifier);
                args.append("code_challenge", codeChallenge);
                args.append("code_challenge_method", challengeMethod);
            }

            if (configParams['additionalParams'].length > 0) {
                // Manually appending because additionalParams might contain '&'
                var argsStr = args.toString() + "&" + configParams['additionalParams'];
                window.location = configParams['authorizeEndpoint'] + "/?" + argsStr;
            } else {
                window.location = configParams['authorizeEndpoint'] + "/?" + args.toString();
            }
        });
}


document.getElementById("refreshButton").onclick = function () {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleXhrResponse(this, true);
    };
    xhr.responseType = 'json';
    xhr.open("POST", bffEndpoint, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(new URLSearchParams({
        client_id: configParams['clientId'],
        client_secret: configParams['clientSecret'],
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        endpoint: configParams['tokenEndpoint']
    }));
}

document.getElementById("revokeButton").onclick = function () {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.status == 200) {
            document.getElementById("result").innerHTML = "<b>Token revoked successfully.</b><br/><br/>" + message;
        } else {
            document.getElementById("result").innerHTML = "Token revocation failed: <pre>" + JSON.stringify(this.response, null, 4) + "</pre>" + message;
        }
    };
    xhr.responseType = 'json';
    xhr.open("POST", bffEndpoint, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(new URLSearchParams({
        client_id: configParams['clientId'],
        client_secret: configParams['clientSecret'],
        token: access_token,
        endpoint: configParams['revokeEndpoint']
    }));
}

document.getElementById("introspectButton").onclick = function () {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status == 200) {
            document.getElementById("result").innerHTML = "Introspection Response: <pre>" + JSON.stringify(this.response, null, 4) + "</pre>" + message;
        } else {
            document.getElementById("result").innerHTML = "Token introspection failed: <pre>" + JSON.stringify(this.response, null, 4) + "</pre>" + message;
        }
    };
    xhr.responseType = 'json';
    xhr.open("POST", bffEndpoint, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(new URLSearchParams({
        client_id: configParams['clientId'],
        client_secret: configParams['clientSecret'],
        token: access_token,
        endpoint: configParams['introspectEndpoint']
    }));
}

document.getElementById("logoutButton").onclick = function () {
    var state = generateRandomString(10);

    var args = new URLSearchParams({
        post_logout_redirect_uri: redirectUri,
        state: state
    });
    if (id_token) {
        args.append('id_token_hint', id_token);
    }
    window.location = configParams['logoutEndpoint'] + "/?" + args;

}

//document.getElementById("showhideconfigs").onclick = function() {
//
//    var configBlock = document.getElementById('configParams');
//    var button = document.getElementById("showhideconfigs");
//    if (configBlock.style.display != 'none') {
//        configBlock.style.display = 'none';
//        button.textContent = "Show Configs";
//    } else {
//        configBlock.style.display = 'block';
//        button.textContent = "Hide Configs";
//    }
//    setCookie('showhideconfigs', configBlock.style.display);
//}

async function generateCodeChallenge(codeVerifier) {
    var digest = await crypto.subtle.digest("SHA-256",
        new TextEncoder().encode(codeVerifier));

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function setCookie(cname, cvalue) {
    var basedUrl = window.location.pathname.split('?')[0];
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + basedUrl;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function getHashParams() {
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
        hashParams[d(e[1])] = d(e[2]);

    return hashParams;
}

if (!crypto.subtle) {
    document.writeln('<p>' +
        '<b>WARNING:</b> The script will fall back to using plain code challenge as crypto is not available.</p>' +
        '<p>Javascript crypto services require that this site is served in a <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts">secure context</a>; ' +
        'either from <b>(*.)localhost</b> or via <b>https</b>. </p>' +
        '<p> You can add an entry to /etc/hosts like "127.0.0.1 public-test-client.localhost" and reload the site from there, enable SSL using something like <a href="https://letsencrypt.org/">letsencypt</a>, or refer to this <a href="https://stackoverflow.com/questions/46468104/how-to-use-subtlecrypto-in-chrome-window-crypto-subtle-is-undefined">stackoverflow article</a> for more alternatives.</p>' +
        '<p>If Javascript crypto is available this message will disappear.</p>')
}