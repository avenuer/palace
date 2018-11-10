import { Organization } from "@elizer/shared";
import { decrypt, encrypt } from "./cryto";

enum Liensce {
  Algorithm = "aes192",
  Password = "random+passkey"
}

const { Algorithm, Password } = Liensce;

export async function encryptLiensce(org: Organization) {
  return encrypt(Algorithm, Password)(JSON.stringify(org));
}

export async function decryptLiensce(key: string) {
  return JSON.parse(decrypt(Algorithm, Password)(key)) as Organization;
}
