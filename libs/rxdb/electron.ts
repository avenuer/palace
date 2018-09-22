
import to from 'await-to-js';
import * as leveldown from 'leveldown';
import { join } from 'path';
import { mainframe } from './mainframe';
import { DBKollections } from './interface';

/** the typeof adapter for rxdb */
const DB_ADAPTER = 'leveldb';
/** database plugin adapters to use */
const rxDbPlugins = [require('pouchdb-adapter-leveldb')];
/** pouchdb options */
const options = {} as any;
const dir = join(process.env.HOMEPATH || __dirname, 'ditla', 'database');
options['db'] = (name: string) => (leveldown as any)(join(dir, name));

export async function electronDatabase(): Promise<[Error, DBKollections]> {
  /** initalize the database once alone */
  // logger.debug({ message: `setting up database at ${dir} `, trace: 'database:: ElectronDatabase' });
  return await to(mainframe(DB_ADAPTER, options, rxDbPlugins)) as any;
}

export default electronDatabase();
