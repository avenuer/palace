import { throwError } from "@elizer/screwbox";
import { Logger } from "@elizer/util";
import { to } from "await-to-js";
import * as RxDB from "rxdb";
import { DBKollections } from "./interface";
import { CollectionConfig, defaultModelMiddleWare } from "./shared";
import { memberModel } from "./models/members.schema";
import { attendanceModel } from "./models/attendance.schema";
import { imageModel } from "./models/image.schema";

/** Logger For Database Scope */
export const logger = new Logger("@dilta/electron:rxdb::models");
/** the database name for rxdb */
const DB_NAME = "database";

/** collection configurations to be created on the database */
export const KOLLECTIONS = [memberModel, attendanceModel, imageModel];

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
) {
  applyPlugins(plugins);
  try {
    const db = await RxDB.create({
      name: DB_NAME,
      adapter: DB_ADAPTER,
      pouchSettings: options
    });
    await initalizeKolls(db, KOLLECTIONS);
    return db as DBKollections;
  } catch (error) {
    throwError(error); 
  }
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
  db: RxDB.RxDatabase,
  configs: CollectionConfig<any>[]
) {
  if (!configs.length || configs.length < 1) {
    throw configsError;
  }
  for (const config of configs) {
    const options: any = config.options || defaultModelMiddleWare;
    const collection = await db.collection({
      name: config.collection || config.name,
      schema: config.schema
    });
    // logger.debug({ message: `added ${config.name} collection to the database`, trace: 'setup::initalizeKolls'  });
    applyMiddleWare(collection, options);
  }
}

/** applys middleware functions to the collection */
function applyMiddleWare(collection: RxDB.RxCollection<any>, options: any) {
  Object.keys(options).forEach(key => {
    (collection as any)[key](options[key], false);
  });
}

export function applyPlugins(plugins: any[] | undefined) {
  if (plugins) {
    plugins.forEach(RxDB.plugin);
  }
  logger.info({
    message: `setup:::mainframe: intialize rxdb plugins`,
    trace: "setup::applyPlugins"
  });
}

/** throws error for empty of undefined config */
export const configsError = new Error(`configs array for intializing database collections
 cannot be empty or undefined.
`);
