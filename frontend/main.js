const {app, protocol} = require('electron');

const envVariables = require('./env-variables');
const {createAuthWindow, destroyAuthWin} = require('./main/auth-process');
const createAppWindow = require('./main/app-process');
const authService = require('./services/auth-service');

const {appDomain, appScheme} = envVariables;

// needed, otherwise localstorage, sessionstorage, cookies, etc, become unavailable
// https://electronjs.org/docs/api/protocol#methods
protocol.registerStandardSchemes([appScheme]);

async function showWindow() {

  protocol.registerFileProtocol(appScheme, async (req, callback) => {
    const requestedURL = req.url.replace(`${appScheme}://${appDomain}/`, '').substring(0, req.url.length - 1);

    if (requestedURL.indexOf('callback') === 0) {
      await authService.loadTokens(requestedURL);
      createAppWindow();
      return destroyAuthWin();
    }

    callback(`${__dirname}/renderer/${requestedURL}`);
  }, (err) => {
    if (err) return console.error(err);
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
