import { routes } from '@elizer/routes';
import { IpcMain, Event } from 'electron';
import { EventBus, ApiFormat } from '@elizer/shared';
import { logger } from '@elizer/rxdb';

export function eventBus(ipc: IpcMain) {
  ipc.on(EventBus.Request, async (event: Event, ctx: ApiFormat<any, any>) => {
    logger.info({message: '', trace: '' }, ctx);
    const resp = await routes(ctx);
    logger.debug({ message: 'transport', trace: 'eventBus'}, resp);
    event.sender.send(EventBus.Response, resp);
  });
}
