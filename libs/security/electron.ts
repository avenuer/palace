import { dialog, BrowserWindow } from "electron";
import { Organization, ApiFormat, SelectDecryptedLiensce, OtherQueryResponse } from '@elizer/shared';
import { promisify } from "util";
import { decryptLiensce } from "./liensce";
import { readFile } from "fs";
import { join } from "path";
import { successResponse, failureResponse } from "libs/routes/shared";

export async function selectDecryptLiensce(ctx: ApiFormat<any, any>) {
    return new Promise<OtherQueryResponse<SelectDecryptedLiensce>>((resolve, reject) => {
  
      dialog.showOpenDialog(
        BrowserWindow.getFocusedWindow(),
        { buttonLabel: "select", title: "Palace Liensce" },
        async (path: string[]) => {
          try {
            const key = await promisify(readFile)(join.apply(global, path), "utf8");
            resolve(successResponse(ctx, {
              key,
              decrypted: await decryptLiensce(key),
            }));
          } catch (error) {
            reject(failureResponse(ctx, error));
          }
        }
      );
    })
  }