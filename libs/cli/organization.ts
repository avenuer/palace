import { Organization } from "@elizer/shared";
import { defaultPreInsert } from "@elizer/rxdb";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { encryptLiensce } from "libs/security/liensce";
import { encrypt } from "./rsa";

const DB_PATH = join(process.cwd(), "database");
const DB_NAME = "liensces.json";

// enum Liensce {
//   Algorithm = (process.env.LIENSCE_ALGORITHM as any),
//   Password = (process.env.LIENSCE_PASSWORD as any),
// }
export enum Liensce {
  Algorithm = 'aes192',
  Password = '1Abiodun',
}


function readDB(): Organization[] {
  if (existsSync(join(DB_PATH, DB_NAME))) {
    return JSON.parse(readFileSync(join(DB_PATH, DB_NAME), "utf8"));
  }
  writeDB([]);
  return readDB();
}

function writeDB(db: Organization[]) {
  if (!existsSync(join(DB_PATH))) {
    mkdirSync(DB_PATH);
  }
  writeFileSync(join(DB_PATH, DB_NAME), JSON.stringify(db), "utf8");
}

function saveOrganization(org: Organization) {
  const db = readDB();
  db.push(org);
  writeDB(db);
}

export async function encryptOrg(org: Organization) {
  const { Algorithm, Password } = Liensce;
  const newOrg = defaultPreInsert(org);
  const key = await encrypt(Algorithm as any, Password as any)(JSON.stringify(newOrg));
  if (!existsSync(join(DB_PATH))) {
    mkdirSync(join(DB_PATH));
  }
  writeFileSync(join(DB_PATH, `${newOrg.name}-${newOrg.createdAt}.crown`), key, "utf8");
  saveOrganization(newOrg);
}
