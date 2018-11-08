import { createCipher, createDecipher } from 'crypto';


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
    return decrypted;
  }
}