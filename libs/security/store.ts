import { deletePassword, getPassword, setPassword } from "keytar";
import {
  Platform,
  Organization,
  ApiFormat,
  ApiStatus,
  OtherQueryResponse
} from "@elizer/shared";
import { failureResponse, successResponse } from "libs/routes/shared";
import { decryptLiensce } from "./liensce";

const ENCRYPTION_TYPE = "RSA-SHA256";
const LIENSCE_ACCT = "Liensce-acct";

export async function setLiensce(ctx: ApiFormat<string, any>) {
  try {
    const res = await setPassword(Platform.Name, LIENSCE_ACCT, ctx.data).then(
      () => true
    );
    return successResponse(ctx, res);
  } catch (error) {
    return failureResponse(ctx, error);
  }
}

export async function retrieveLiensce(
  ctx: ApiFormat<any, any>
): Promise<OtherQueryResponse<Organization>> {
  try {
    const encrypted = await getPassword(Platform.Name, LIENSCE_ACCT);
    if (encrypted) {
      // decrypt and send.
      const decrypted = await decryptLiensce(encrypted);
      return successResponse(ctx, decrypted);
    }
    throw noLiensceError;
  } catch (error) {
    return failureResponse(ctx, error);
  }
}

const noLiensceError = new Error("Liensce Key Missing For the software");

export async function deleteLiensce(ctx: ApiFormat<any, any>) {
  try {
    return successResponse(
      ctx,
      await deletePassword(Platform.Name, LIENSCE_ACCT)
    );
  } catch (error) {
    return failureResponse(ctx, error);
  }
}
