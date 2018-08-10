const { ipcRenderer } = require('electron');

ipcRenderer.send('loaded');

document.getElementById('logout').onclick = () => {
  ipcRenderer.send('logout');
};

document.getElementById('secured-request').onclick = () => {
  ipcRenderer.send('secured-request');
};

ipcRenderer.on('load-profile', (event, props) => {
  const {profile} = props;

  document.getElementById('picture').src = profile.picture;
  document.getElementById('name').innerText = profile.name;
  document.getElementById('success').innerText = 'You successfully used OpenID Connect and OAuth 2.0 to authenticate.';
});

ipcRenderer.on('secured-request-response', (event, props) => {
  const messageJumbotron = document.getElementById('message');
  messageJumbotron.innerText = props.message;
  messageJumbotron.style.display = 'block';
});
