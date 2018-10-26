import { app, BrowserWindow, dialog } from 'electron' // eslint-disable-line
import PouchDB from 'pouchdb';
import * as path from 'path';
import { writeFile } from 'fs';

process.env.PALACE_PROJECT = path.join(process.env.LOCALAPPDATA, 'palace');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

global.logger = require('winston');
global.logger.log('sss');
global.dialog = dialog;

PouchDB.plugin(require('pouchdb-find'));
global.memberDB = new PouchDB(path.join(process.env.PALACE_PROJECT, 'database'));
// global.memberDB.bulkDocs(require('./database.json')).then(console.log).catch(console.log);

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

async function dumpDB() {
  const string = JSON.stringify(await global.memberDB.allDocs({ include_docs: true }));
  dialog.showSaveDialog(
    mainWindow,
    { title: 'save database dump' },
    (filename) => {
      writeFile(filename, string, (err) => {
        if (err) {
          global.logger.error(err);
        }
      });
    });
}

global.dumpDB = dumpDB;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
