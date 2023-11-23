import promptSync from "prompt-sync";
import * as fs from "fs";

const prompt = promptSync();

const username = prompt("Username: ");
const password = prompt("Password: ");
const clearance = prompt("Clearance (B, NV1, NV2, PV): ");

fs.writeFileSync(
  `./sources/users/${username}.json`,
  JSON.stringify({
    username,
    password,
    clearance
  })
);
