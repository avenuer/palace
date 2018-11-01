import {
  ApiFormat,
  Security,
  OtherQueryResponse,
  ApiStatus
} from "@elizer/shared";
import {
  setLiensce,
  retrieveLiensce,
  deleteLiensce,
  selectDecryptLiensce
} from "libs/security";

const { DeleteLiensce, RetrieveLiensce, SetLiensce, DecryptLiensce } = Security;
export const securityRoutes = [
  DeleteLiensce,
  RetrieveLiensce,
  SetLiensce,
  DecryptLiensce
];

export async function securityRoute(
  ctx: ApiFormat<any, any>
): Promise<OtherQueryResponse<any>> {
  try {
    let res: any;
    switch (ctx.method) {
      case SetLiensce:
        res = await setLiensce(ctx.data);
      case RetrieveLiensce:
        res = await retrieveLiensce();
      case DeleteLiensce:
        res = await deleteLiensce();
      case DecryptLiensce:
        res = await selectDecryptLiensce(ctx);
      default:
        break;
    }
    return {
      data: res,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  }
}
