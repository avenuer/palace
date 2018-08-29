import { throwError } from '@elizer/screwbox';
import { Logger } from '@elizer/util';
import { to } from 'await-to-js';
import * as RxDB from 'rxdb';
import { RxDatabase } from 'rxdb';
import { DBKollections } from './interface';
import { CollectionConfig, defaultModelMiddleWare } from './shared';
import { memberModel } from './models/members.schema';
import { attendanceModel } from './models/attendance.schema';

/** Logger For Database Scope */
export const logger = new Logger('@dilta/electron:rxdb::models');
/** the database name for rxdb */
const DB_NAME = 'database';

/** collection configurations to be created on the database */
export const Kollections = [
  memberModel,
  attendanceModel
];

/**
 * returns the intialized database connections
 *
 * @export
 * @param {string} DB_ADAPTER storage adapter
 * @param {*} [options={}] options to be passed to pouchdb
 * @param {any[]} [plugins] Arrays of pouchdb plugins
 * @returns {Promise<DBKollections>}
 */
export async function mainframe(
  DB_ADAPTER: string,
  options = {},
  plugins?: any[]
): Promise<DBKollections> {
  applyPlugins(plugins);
  let db: RxDatabase, err: Error;
  [err, db] = await to<RxDatabase | any, Error | any>(
    RxDB.create({
      name: DB_NAME,
      adapter: DB_ADAPTER,
      pouchSettings: options
    })
  );
  throwError(err);
  // logger.debug({ message: `finshed intializing the database`, trace: 'setup::mainframe'  });
  [err] = await to(initalizeKolls(db, Kollections));
  throwError(err);
  return db as any;
}

/**
 * it creates new collections from the array of configurations given
 * to it.
 *
 * @param {RxDatabase} db an intialize database
 * @param {CollectionConfig[]} configs kollection configurations to be created on the db
 * @returns an object containing the kollections
 */
export async function initalizeKolls(
  db: RxDatabase,
  configs: Array<CollectionConfig<any>>
) {
  if (!configs.length || configs.length < 1) {
    throw configsError;
  }
  for (const config of configs) {
    const options: any = config.options || defaultModelMiddleWare;
    const [err, collection] = await to(
      db.collection({
        name: config.collection || config.name,
        schema: config.schema
      })
    );
    throwError(err);
    // logger.debug({ message: `added ${config.name} collection to the database`, trace: 'setup::initalizeKolls'  });
    Object.keys(options).forEach(key => {
      (collection as any)[key](options[key], false);
    });
  }
}

export function applyPlugins(plugins: any[] | undefined) {
  if (plugins) {
    plugins.forEach(RxDB.plugin);
  }
  logger.info({
    message: `setup:::mainframe: intialize rxdb plugins`,
    trace: 'setup::applyPlugins'
  });
}

/** throws error for empty of undefined config */
export const configsError = new Error(`configs array for intializing database collections
 cannot be empty or undefined.
`);
