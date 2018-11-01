import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import * as NodeRSA from 'node-rsa';

import { createCipher, createDecipher } from 'crypto';

interface Keypair {
  public: string;
  private: string;
}

export async function genKeys(path: string) {
  const key = new NodeRSA({ b: 2048 });
    const keyDir = join(path);
    if (!existsSync(keyDir)) {
      mkdirSync(keyDir);
    }
    writeFileSync(join(keyDir, "private.key"),  key.exportKey('pkcs1-private'));
    writeFileSync(join(keyDir, "public.key"), key.exportKey('pkcs1-public'));
}

function keysGenerator(password: string) {
  
}

export function encrypt(alog: string, password:string) {
  const cipher = createCipher(alog, password);
  return (item: string) => {
    const encrypted = cipher.update(item, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
  }
}

export function decrypt(alog: string, password:string) {
  const dipher = createDecipher(alog, password);
  return (item: string) => {
    const decrypted = dipher.update(item, 'hex', 'utf8') + dipher.final('utf8');
    console.log(decrypted)
  }
}