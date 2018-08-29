import { routes } from '@elizer/routes';
import { IpcMain, Event } from 'electron';
import { EventBus, ApiFormat } from '@elizer/shared';

export function eventBus(ipc: IpcMain) {
  ipc.on(EventBus.Request, async (event: Event, ctx: ApiFormat<any, any>) => {
    event.sender.emit(EventBus.Response, await routes(ctx));
  });
}
