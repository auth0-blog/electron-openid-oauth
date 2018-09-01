const jwtDecode = require('jwt-decode');
const request = require('request');
const url = require('url');
const envVariables = require('../env-variables');
const storeService = require('./store-service');

const {apiIdentifier, appDomain, appScheme, auth0Domain, clientId} = envVariables;

const redirectUri = `${appScheme}://${appDomain}/callback`;

let accessToken = null;
let profile = null;
let refreshToken = null;

function getAccessToken() {
  return accessToken;
}

function getProfile() {
  return profile;
}

function getAuthenticationURL() {
  return 'https://' + auth0Domain + '/authorize?' +
    'audience=' + apiIdentifier + '&' +
    'scope=openid profile offline_access&' +
    'response_type=code&' +
    'client_id=' + clientId + '&' +
    'redirect_uri=' + redirectUri;
}

function refreshTokens() {
  return new Promise((resolve, reject) => {
    const refreshToken = storeService.get('refresh-token');

    if (!refreshToken) return reject();

    const refreshOptions = { method: 'POST',
      url: `https://${auth0Domain}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: { grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: storeService.get('refresh-token')
      },
      json: true,
    };

    request(refreshOptions, function (error, response, body) {
      if (error) {
        logout();
        return reject();
      }

      accessToken = body.access_token;
      profile = jwtDecode(body.id_token);

      resolve();
    });
  });
}

function loadTokens(callbackURL) {
  return new Promise((resolve, reject) => {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'code': query.code,
      'redirect_uri': redirectUri,
    };

    const options = {
      method: 'POST',
      url: `https://${auth0Domain}/oauth/token`,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(exchangeOptions),
    };

    request(options, (error, resp, body) => {
      if (error) {
        logout();
        return reject(error);
      }

      const responseBody = JSON.parse(body);
      accessToken = responseBody.access_token;
      profile = jwtDecode(responseBody.id_token);
      refreshToken = responseBody.refresh_token;

      storeService.set('refresh-token', refreshToken);

      resolve();
    });
  });
}

function logout() {
  storeService.remove('refresh-token');
  accessToken = null;
  profile = null;
  refreshToken = null;
}

module.exports = {
  getAccessToken,
  getAuthenticationURL,
  getProfile,
  loadTokens,
  logout,
  refreshTokens,
};
