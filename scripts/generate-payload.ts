import fs from "fs";
import { webcrypto } from "crypto";
import JSZip from "jszip";
const crypto = webcrypto.subtle;

const clearanceHierarchy = ["B", "NV1", "NV2", "PV"];

function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export const encryptSymmetric = async (plaintext: string, key: ArrayBuffer) => {
  // create a random 96-bit initialization vector (IV)
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  // encode the text you want to encrypt
  const encodedPlaintext = new TextEncoder().encode(plaintext);

  // prepare the secret key for encryption
  const secretKey = await crypto.importKey(
    "raw",
    key,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  // encrypt the text with the secret key
  const ciphertext = await crypto.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    secretKey,
    encodedPlaintext
  );

  // return the encrypted text "ciphertext" and the IV
  // encoded in base64
  return {
    ciphertext: Buffer.from(ciphertext).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
};

const outputDir = "./content/docs/";

// Load users
const usersFiles = fs.readdirSync(`./sources/users/`);
const users: Array<{ username: string; password: string; clearance: string }> =
  [];
usersFiles.forEach((e) => {
  let path = `./sources/users/${e}`;
  let user = JSON.parse(fs.readFileSync(path, "utf-8"));
  users.push(user);
});

// Load content
const zip = new JSZip();

const files = fs.readdirSync(`./sources/docs/`);
const userIDs: string[] = [];
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (!file.endsWith(".pdf")) continue;
  const id = buf2hex(await crypto.digest("SHA-1", Buffer.from(file)));
  const data = fs.readFileSync(`./sources/docs/${file}`);

  const metadataPath = `./sources/docs/${file}.json`;
  let metadata: { clearance?: string } = {};
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  }

  const idFolder = zip.folder(`${id}`);

  for (let m = 0; m < users.length; m++) {
    const user = users[m];

    if (metadata.clearance) {
      const userIndex = clearanceHierarchy.findIndex(
        (m) => m == user.clearance
      );
      const docIndex = clearanceHierarchy.findIndex(
        (m) => m == metadata.clearance
      );
      if (docIndex > userIndex) {
        continue;
      }
    }

    const userID = buf2hex(
      await crypto.digest("SHA-1", Buffer.from(user.username))
    );
    userIDs.push(userID);

    const key = await crypto.digest("SHA-256", Buffer.from(user.password));

    const encryptedData = await encryptSymmetric(
      JSON.stringify({
        filename: file,
        data: data.toString("base64"),
        clearance: metadata.clearance ?? "B",
      }),
      key
    );

    idFolder?.file(`${userID}.json`, JSON.stringify(encryptedData));
  }
}

zip.file(`ids.json`, JSON.stringify({ userIDs }));

zip.generateNodeStream().pipe(fs.createWriteStream(`./public/payload.zip`));
