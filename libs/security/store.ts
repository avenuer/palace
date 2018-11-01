import { deletePassword, getPassword, setPassword } from 'keytar';
import { Platform, Organization } from '@elizer/shared';


const ENCRYPTION_TYPE = 'RSA-SHA256';
const LIENSCE_ACCT = 'Liensce-acct';

export async function setLiensce(key: string) {
    try {
      setPassword(Platform.Name, LIENSCE_ACCT, key);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  export async function retrieveLiensce() {
    const encrypted = await getPassword(Platform.Name, LIENSCE_ACCT);
    if (encrypted) {
      // decrypt and send.
      return JSON.parse(encrypted) as Organization;
    }
    throw noLiensceError;
  }
  
  const noLiensceError = new Error('Liensce Key Missing For the software');
  
  export async function deleteLiensce() {
    return await deletePassword(Platform.Name, LIENSCE_ACCT);
  }
  