import { readFile } from "fs";
import { OfflineDB } from "libs/rxdb/interface";
import {
  Member,
  OtherQueryResponse,
  ApiFormat,
  ApiStatus
} from "@elizer/shared";
import { defaultPreInsert } from "@elizer/rxdb";
import { dialog, BrowserWindow } from "electron";
import { join } from "path";
import { promisify } from "util";
import { EventEmitter } from "events";

enum MigratorEvents {
  Prototype = "migrate prototype"
}

interface RootObject {
  total_rows: number;
  offset: number;
  rows: Row[];
}

interface Row {
  id: string;
  key: string;
  doc: Doc;
}

interface Doc {
  firstname: string;
  phoneNo: string;
  email: string;
  department: string;
  address: string;
  level: string;
  lastname: string;
  birthday: number;
  gender: string;
  vistor: boolean;
  student: boolean;
  _id: string;
  _rev: string;
  birthmonth: string;
  sundays: null[];
  language: string;
}

// event emitter to respond to various emit fuctionality
const migrator = new EventEmitter();
export async function migratePrototype(
  db: OfflineDB,
  ctx: ApiFormat<any, any>
): Promise<OtherQueryResponse<string>> {
  migrator.emit(MigratorEvents.Prototype, db);
  return {
    data: `migration operation started for ${ctx.id}`,
    reqId: ctx.id,
    status: ApiStatus.Success,
    time: Date.now()
  };
}

migrator.on(MigratorEvents.Prototype, (db: OfflineDB) => {
  dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow(),
    { buttonLabel: "migrate", title: "Palace Migration" },
    async (path: string[]) => {
      try {
        const dump = JSON.parse(
          await promisify(readFile)(join.apply(global, path), "utf8")
        );
        const organzation = path[path.length - 1].split(".")[0].toString();
        cleanAndMapDumps(dump, organzation).forEach(savePrototypeMembers(db));
      } catch (error) {
        console.log(error);
        dialog.showErrorBox(
          "Prototype Migration",
          `${(error as Error).message} failed during insert of docs`
        );
      }
    }
  );
});

function savePrototypeMembers(db: OfflineDB) {
  return (doc: Member) => {
    console.log(doc);
    db.member.insert(doc).catch(err => {
      console.log(err);
      dialog.showErrorBox(
        "Prototype Migration",
        `${doc.name} failed during insert of docs`
      );
    });
  };
}

function cleanAndMapDumps(dump: RootObject, organization: string) {
  return dump.rows
    .filter(e => (!!Number(e.doc._id) && (e.doc.firstname || e.doc.lastname)))
    .map(e => mapDocToMember(organization, e.doc));
}

function mapDocToMember(organization: string, doc: Doc): Member {
  const preDoc = defaultPreInsert({});
  return {
    ...preDoc,
    organization,
    name: `${doc.firstname}  ${doc.lastname}`,
    address: doc.address || "unspecified",
    churchNo: Number(doc._id),
    day: Number(doc.birthday),
    department: doc.department,
    level: doc.level,
    email: doc.email,
    gender: doc.gender || "unspecified",
    isVisitor: doc.vistor,
    month: doc.birthmonth,
    phoneNo: doc.phoneNo || "unspecified",
    isStudent: doc.student
  };
}
