interface Decode {
  token: string;
}

function decode({ token }: Decode) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [_, payload] = parts;

  return JSON.parse(fromBase64(payload));
}

export function fromBase64(encoded: string) {
  return Buffer.from(encoded, "base64").toString();
}
export default decode;
