import JSZip from "jszip";

export interface User {
  username: string;
  password: string;
  userID: string;
  key: ArrayBuffer;
}

export interface GFDocument {
  auth: string;
  enc: string;
  title: string;
  iv: string;
}

export interface Payload {
  ids: { userIDs: string[] };
  documents: {
    [key: string]: { [key: string]: { ciphertext: string; iv: string } };
  };
}

const crypto = window.crypto.subtle;
const payload = useState<Payload>("payload");

function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export const genUserId = async (username: string) => {
  return buf2hex(await crypto.digest("SHA-1", Buffer.from(username)));
};

export const genKey = async (password: string) => {
  return await crypto.digest("SHA-256", Buffer.from(password));
};

export const decryptSymmetric = async (
  ciphertext: string,
  iv: string,
  key: ArrayBuffer
) => {
  // prepare the secret key
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

  // decrypt the encrypted text "ciphertext" with the secret key and IV
  const cleartext = await crypto.decrypt(
    {
      name: "AES-GCM",
      iv: Buffer.from(iv, "base64"),
    },
    secretKey,
    Buffer.from(ciphertext, "base64")
  );

  // decode the text and return it
  return new TextDecoder().decode(cleartext);
};

export const importPayload = async () => {
  const data: Blob = await $fetch("/payload.zip");
  const content = await JSZip.loadAsync(data);

  // Load ids
  const ids = JSON.parse(await content.files["ids.json"].async("text"));
  payload.value = { ids: ids, documents: {} };

  // Load documents
  const entries = Object.entries(content.files);
  for (let i = 0; i < entries.length; i++) {
    const [filename, file] = entries[i];
    if (!filename.endsWith(".json")) continue;
    if (filename == "ids.json") continue;
    const [folder, name] = filename.split("/");
    if (!(folder && name)) continue;
    if (!name.endsWith(".json")) continue;

    const fileID = name.substring(0, name.indexOf(".json"));
    console.log(fileID);

    // Now we're pretty sure this is an actual file
    payload.value.documents[folder] ??= {};
    payload.value.documents[folder][fileID] = JSON.parse(
      await file.async("text")
    );
  }
};
