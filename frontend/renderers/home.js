const {remote} = require('electron');
const axios = require('axios');
const authService = remote.require('./services/auth-service');
const authProcess = remote.require('./main/auth-process');

const webContents = remote.getCurrentWebContents();

webContents.on('dom-ready', () => {
  const profile = authService.getProfile();
  document.getElementById('picture').src = profile.picture;
  document.getElementById('name').innerText = profile.name;
  document.getElementById('success').innerText = 'You successfully used OpenID Connect and OAuth 2.0 to authenticate.';
});

document.getElementById('logout').onclick = () => {
  authProcess.createLogoutWindow();
  remote.getCurrentWindow().close();
};

document.getElementById('secured-request').onclick = () => {
  axios.get('http://localhost:3000/private', {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
    },
  }).then((response) => {
    const messageJumbotron = document.getElementById('message');
    messageJumbotron.innerText = response.data;
    messageJumbotron.style.display = 'block';
  }).catch((error) => {
    if (error) throw new Error(error);
  });
};
