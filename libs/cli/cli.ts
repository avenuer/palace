import * as inquirer from "inquirer";
import { genKeys, decrypt } from "./rsa";
import { Organization } from "@elizer/shared";
import { encryptOrg, Liensce } from "./organization";
import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";
import { decryptLiensce } from "libs/security/liensce";

const inq = inquirer.createPromptModule();
const seperator = new inquirer.Separator();

enum Commands {
  RSA = "rsa",
  Liensce = "liensce"
}

async function conversation() {
  try {
    const conv: any = await inq({
      name: "operation",
      message: "enter the Elizer Cli operation",
      type: "list",
      choices: [Commands.RSA, Commands.Liensce]
    });
    switch (conv.operation) {
      case Commands.RSA:
        return genRsa();
      case Commands.Liensce:
        return liensceOperation();
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

enum LiensceOperation {
  Generate = "generate",
  Decrypt = "decrypt"
}

async function liensceOperation() {
  const ans: any = await inq({
    name: "operation",
    message: 'liensce operation type',
    type: 'list',
    choices: [LiensceOperation.Generate, LiensceOperation.Decrypt]
  });
  return (ans['operation'] === LiensceOperation.Generate) ? generateLiensce() : decryptRsa();
}

async function decryptRsa() {
  const { Algorithm, Password } = Liensce;
  try {
    const ans: any = await inq({
      name: "path",
      type: "input",
      message: "enter the path for the liensce key to decrypt"
    });
    const key = await promisify(readFile)(join(ans.path), "utf8");
    console.log(await decrypt(Algorithm, Password)(key));
  } catch (error) {
    console.error(error);
  }
}

async function genRsa() {
  const ans: any = await inq({
    name: "path",
    type: "input",
    message: "enter the path to place the key pairs"
  });
  genKeys(ans.path);
}

async function generateLiensce() {
  const org: Organization = (await inq([
    {
      name: "name",
      message: "name of the organization or church"
    },
    {
      name: "email",
      message: "organization email"
    },
    {
      name: "phoneNo",
      message: "organization phone number"
    },
    {
      name: "address",
      message: "address of the organization or church"
    },
    {
      name: "town",
      message: "organization town location"
    },
    {
      name: "state",
      message: "organization state"
    }
  ])) as any;
  encryptOrg(org);
}

conversation();
