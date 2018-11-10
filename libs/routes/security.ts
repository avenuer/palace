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

export async function securityRoute(ctx: ApiFormat<any, any>) {
  switch (ctx.method) {
    case SetLiensce:
      return await setLiensce(ctx);
    case RetrieveLiensce:
      return await retrieveLiensce(ctx);
    case DeleteLiensce:
      return await deleteLiensce(ctx);
    case DecryptLiensce:
      return await selectDecryptLiensce(ctx);
    default:
      break;
  }
}
