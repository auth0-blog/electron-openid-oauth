const {BrowserWindow, ipcMain} = require('electron');
const request = require('request');
const authService = require('../services/auth-service');

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

  win.loadURL(`file:///home.html`);

  win.on('closed', () => {
    win = null;
  });
};
