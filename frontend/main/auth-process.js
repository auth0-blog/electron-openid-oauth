const {BrowserWindow} = require('electron');
const authService = require('../services/auth-service');
const createAppWindow = require('../main/app-process');

let win = null;

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createAuthWindow() {
  destroyAuthWin();

  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  win.loadURL(authService.getAuthenticationURL());

  win.webContents.on('did-get-redirect-request', async (event, oldUrl, callbackUrl) => {
    if (callbackUrl.indexOf('file:///callback') < 0) return;
    await authService.loadTokens(callbackUrl);
    createAppWindow();
    return destroyAuthWin();
  });

  win.on('authenticated', () => {
    destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

module.exports = createAuthWindow;
