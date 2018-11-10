import { BrowserWindow, dialog, globalShortcut } from "electron";
import { writeFile } from "fs";

/**
 * Developer shortcuts for the application
 *
 * @export
 * @enum {number}
 */
export enum AppDevShortcut {
  ScreenShot = "CommandOrControl + shift + s + t",
  ToggleDevTool = "CommandOrControl + shift + i"
}

const extensions = [
  `C:/Users/AbiZeus/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0`,
  `C:/Users/AbiZeus/AppData/Local/Google/Chrome/User Data/Default/Extensions/elgalmkoelokbchhkhacckoklkejnhcd/1.19.1_0`
];

/**
 * adds 3rd party apps to electron dev tools
 *
 * @export
 */
export async function addExtension() {
  extensions.forEach(async path => {
    await BrowserWindow.addDevToolsExtension(path);
  });
}

/**
 * registers devtools shortcuts for the application
 *
 * @export
 * @param {BrowserWindow} browserWindow
 */
export function shortcuts(browserWindow: BrowserWindow) {
  globalShortcut.register(AppDevShortcut.ScreenShot, () =>
    screenShot(browserWindow)
  );
  globalShortcut.register(AppDevShortcut.ToggleDevTool, () =>
    toogleDevTool(browserWindow)
  );
}

/**
 * captures the page as screen shot and tooggle save dialog
 *
 * @export
 * @param {BrowserWindow} browserWindow
 */
export function screenShot(browserWindow: BrowserWindow) {
  browserWindow.capturePage(img => {
    img.toPNG();
    dialog.showSaveDialog(
      browserWindow,
      {
        title: "save screen shot",
        filters: [
          {
            name: "images",
            extensions: ["png"]
          }
        ]
      },
      filename => {
        if (filename) {
          writeFile(filename, img.toPNG(), err => {
            if (err) {
              dialog.showErrorBox(
                "Prototype Migration",
                `${err.name}: ${err.message}`
              );
            }
          });
        }
      }
    );
  });
}

/**
 * responds by toggling the app devtool with a shortcut
 *
 * @export
 * @param {BrowserWindow} browserWindow
 * @returns
 */
export function toogleDevTool(browserWindow: BrowserWindow) {
  const {
    isDevToolsOpened,
    closeDevTools,
    openDevTools
  } = browserWindow.webContents;
  console.log(isDevToolsOpened());
  return isDevToolsOpened()
    ? closeDevTools()
    : openDevTools({ mode: "detach" });
}

/**
 * registers all dev custom functions
 *
 * @export
 * @param {BrowserWindow} browserWindow
 */
export async function devtools(browserWindow: BrowserWindow) {
  addExtension();
  shortcuts(browserWindow);
}


export function isDev() {
  console.log( process.env.ELECTRON_IS_DEV)
  return process.env.ELECTRON_IS_DEV === 'development';
}