import { app, BrowserWindow, ipcMain } from "electron";
import { eventBus } from "libs/electron/ipc";
import { shortcuts, isDev } from "libs/electron/dev";
import { checkforUpdate } from "libs/electron/update";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, show: false });
  // off toolbars
  win.setMenu(null);

  // and load the index.html of the app.
  win.loadFile('./dist/index.html');
  // win.loadFile(join(process.cwd(), 'dist', 'index.html'));
  // win.loadURL(`http://localhost:3000`);

  // Open the DevTools.
  if (isDev()) {
    // register devtools and shortcuts
    win.webContents.openDevTools();
  }
  shortcuts(win);

  /** show but hide if page not rendered */
  win.on('ready-to-show', () => {
    if (!win) { 
      return;
    }
    win.show();
  });

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on('show', () => {
    setTimeout(() => {
      checkforUpdate(win as BrowserWindow);
    }, 1000 * 60 * 3);
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  eventBus(ipcMain);
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
