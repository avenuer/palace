import { ApiFormat } from "@elizer/shared";
import { modelOrmRoutes, ormRoutes } from './models/route';

export async function routes(ctx: ApiFormat<any, any>) {
    if (ormRoutes.includes(ctx.method as any)) {
        return modelOrmRoutes(ctx);
    }
}