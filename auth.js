const CLIENT_ID = '227047110436-kqjeab0uska8h0jbih1r2mdk2g2lbno1.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCnSqTFY_6xJ20iLOhBjramUbcBAOw8LOY';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid';

let tokenClient;
let gapiInited = false;
let gisInited = false;

if (document.getElementById('authorize_button') != null) {
    document.getElementById('signout_button').hidden = true;
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
});
gapiInited = true;
maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
});
gisInited = true;
maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
if (gapiInited && gisInited && document.getElementById('authorize_button') != null) {
    document.getElementById('authorize_button').hidden = false;
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthorize(resolve, reject){
tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        reject(resp);
    }
    resolve();
    document.getElementById('authorize_button').textContent = 'Relogar';
    document.getElementById('signout_button').hidden = false;
    document.getElementById('content').hidden = false;
    changeOptions();
};

tokenClient.error_callback = async (err) => {
    reject(err);
}

if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
} else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
const token = gapi.client.getToken();
if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('signout_button').hidden = true;
    document.getElementById('authorize_button').textContent = 'Login';
    document.getElementById('content').hidden = true;
}
}

async function authorizeForm(){
    await new Promise((res, rej) => handleAuthorize(res, rej))
} 