import { autoUpdater, UpdateCheckResult } from "electron-updater";
import { dialog, BrowserWindow } from "electron";

enum UpdateOperations {
  cancel = "cancel",
  update = "update"
}

// Token for github authentication
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function checkforUpdate(win:BrowserWindow) {
  try {
    autoUpdater.autoDownload = false;
    const updateInfo = await autoUpdater.checkForUpdatesAndNotify();
    if (updateInfo) {
      downloadUpdate(updateInfo, await confirmDownload(win, updateInfo));
    }
  } catch (error) {
     dialog.showErrorBox('Palace Update', (error as Error).message); 
  }
}


/**
 * retrieve the user response for update permission
 *
 * @param {UpdateCheckResult} updateInfo
 * @returns {Promise<boolean>}
 */
function confirmDownload(win:BrowserWindow, updateInfo: UpdateCheckResult): Promise<boolean> {
  const { cancel, update } = UpdateOperations;
  const ops = [cancel, update];
  return new Promise((resolve, reject) => {
    try {
      dialog.showMessageBox(
        win,
        {
          message: `Palace application version ${
            updateInfo.updateInfo.version
          } update is available`,
          buttons: ops
        },
        (resp, b) => {
          resolve(ops[resp] === update);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * download and installs the update
 *
 * @param {UpdateCheckResult} updateInfo
 * @param {boolean} allowedUpdate
 */
function downloadUpdate(updateInfo: UpdateCheckResult, allowedUpdate: boolean) {
  if (allowedUpdate) {
    autoUpdater.downloadUpdate(updateInfo.cancellationToken);
  }
}
