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

const crypto = window.crypto.subtle;

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
