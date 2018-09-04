const electron = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = electron.app.getPath('userData');

const configPath = path.join(userDataPath, 'electron-app-config.json');

let data = null;
try {
  data = JSON.parse(fs.readFileSync(configPath));
} catch (error) {
  data = {};
}

function get(key) {
  return data[key];
}

function remove(key) {
  delete data[key];
  fs.writeFileSync(configPath, JSON.stringify(data));
}

function set(key, val) {
  data[key] = val;
  fs.writeFileSync(configPath, JSON.stringify(data));
}

module.exports = {
  get,
  remove,
  set,
};
