import { dialog, BrowserWindow } from "electron";
import { Organization, ApiFormat } from '@elizer/shared';
import { promisify } from "util";
import { decryptLiensce } from "./liensce";
import { readFile } from "fs";
import { join } from "path";

export async function selectDecryptLiensce(ctx: ApiFormat<any, any>) {
    return new Promise<Organization>((resolve, reject) => {
  
      dialog.showOpenDialog(
        BrowserWindow.getFocusedWindow(),
        { buttonLabel: "select", title: "Palace Liensce" },
        async (path: string[]) => {
          try {
            const key = await promisify(readFile)(join.apply(global, path), "utf8");
            resolve(await decryptLiensce(key));
          } catch (error) {
            reject(error);
          }
        }
      );
    })
  }