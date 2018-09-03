const {app, protocol} = require('electron');

const createAuthWindow = require('./main/auth-process');
const createAppWindow = require('./main/app-process');
const authService = require('./services/auth-service');

async function showWindow() {
  protocol.interceptFileProtocol('file', async (request, callback) => {
    const requestedURL = request.url.replace('file:///', '');
    callback({path: `${__dirname}/renderers/${requestedURL}`});
  });

  try {
    await authService.refreshTokens();
    return createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', showWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    showWindow();
  }
});
