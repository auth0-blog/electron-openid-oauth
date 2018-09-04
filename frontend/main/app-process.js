const {BrowserWindow} = require('electron');

function createAppWindow() {
  let win = new BrowserWindow({
    width: 1000,
    height: 600,
  });

  win.loadFile('./renderers/home.html');

  win.on('closed', () => {
    win = null;
  });
}

module.exports = createAppWindow;
