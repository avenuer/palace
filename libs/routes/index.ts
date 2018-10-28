import { ApiFormat } from "@elizer/shared";
import { modelOrmRoutes, ormRoutes } from './models/route';
import { followUpRoutes, followupRoutes } from "./followup";
import { migrationRoutes, migrationRoute } from "./migration";

export async function routes(ctx: ApiFormat<any, any>) {
    if (ormRoutes.includes(ctx.method as any)) {
        return await modelOrmRoutes(ctx);
    }
    if (followupRoutes.includes(ctx.method as any)) {
        return await followUpRoutes(ctx);
    }
    if (migrationRoutes.includes(ctx.method as any)) {
        return await migrationRoute(ctx);
    }
}