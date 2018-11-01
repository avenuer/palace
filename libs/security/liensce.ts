import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { Organization } from "@elizer/shared";
import * as NodeRSA from "node-rsa";

export async function encryptLiensce(org: Organization) {
  const privateKey = await promisify(readFile)(
    join(process.cwd(), "keys", "private.key"),
    "utf8"
  );
  return new NodeRSA(privateKey).encrypt(JSON.stringify(org), "hex");
}

export async function decryptLiensce(key: string) {
  const publicKey = await promisify(readFile)(
    join(process.cwd(), "keys", "public.key"),
    "utf8"
  );
  return JSON.parse(
    new NodeRSA(publicKey).decrypt(key, "hex")
  ) as Organization;
}
