const {BrowserWindow, ipcMain} = require('electron');
const request = require('request');
const envVariables = require('../env-variables');
const authService = require('../services/auth-service');

const {appDomain, appScheme} = envVariables;

module.exports = function createAppWindow() {
  let win = new BrowserWindow({
    width: 1000,
    height: 600,
  });

  ipcMain.on('loaded', (event) => {
    event.sender.send('load-profile', {
      profile: authService.getProfile(),
    });
  });

  ipcMain.on('secured-request', (event) => {
    const requestOptions = {
      method: 'GET',
      url: `http://localhost:3000/private`,
      headers: {
        'Authorization': `Bearer ${authService.getAccessToken()}`,
      },
    };

    request(requestOptions, function (error, resp) {
      if (error) throw new Error(error);

      event.sender.send('secured-request-response', {
        message: resp.body,
      });
    });
  });

  ipcMain.on('logout', () => {
    authService.logout();
    win.close();
  });

  win.loadURL(`${appScheme}://${appDomain}/home.html`);

  win.on('closed', () => {
    win = null;
  });
};
