import { decode } from "./index.js";
import { createSignature } from "./sign.js";

export interface VerifyParams {
  token: string;
  secret: string;
}
function verify({ token, secret }: VerifyParams) {
  console.log("In here!:", token);
  const parts = token.split(".");
  console.log("In here!");

  if (parts.length !== 3) {
    console.log("Inside here!");

    throw new Error("Invalid token");
  }

  const [encodedHeader, encodedPayload, tokenSignature] = parts;

  /**
   * Create signature from message (header + payload) and specified secret.
   * If the created signature matches the token signature, then:
   * Token was signed with the specified secret.
   */
  const requiredSignature = createSignature({
    secret,
    encodedHeader,
    encodedPayload,
  });

  console.log("In here!");

  if (tokenSignature !== requiredSignature) {
    throw new Error("Invalid signature");
  }

  const decoded = decode({ token });

  const { exp } = decoded;

  if (hasExpired(exp)) {
    throw new Error("Token has expired");
  }
  console.log("Decoded:", decoded);
  return decoded;
}

function hasExpired(exp: number) {
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}

export default verify;
