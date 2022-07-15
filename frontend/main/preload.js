const { contextBridge, ipcRenderer } = require("electron");

const electronAPI = {
  getProfile: () => ipcRenderer.invoke('auth:get-profile'),
  logOut: () => ipcRenderer.send('auth:log-out'),
  getPrivateData: () => ipcRenderer.invoke('api:get-private-data'),
};

process.once("loaded", () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});
