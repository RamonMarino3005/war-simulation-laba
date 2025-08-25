import crypto from "crypto";

export interface Options {
  expiresIn?: number | string;
}

export interface SignInput {
  payload: object;
  secret: string;
  options?: Options;
}

const defaultOptions = {
  expiresIn: 86400,
};

function sign({ payload, secret, options = {} }: SignInput) {
  const mergedOptions = { ...defaultOptions, ...options };

  // Create Header
  const header = { alg: "HS256", typ: "JWT" };

  const encodedHeader = toBase64(header);

  // Current time in seconds since epoch
  const curr_date = Math.floor(Date.now() / 1000);
  const expiresIn = curr_date + parseExpiresIn(mergedOptions.expiresIn);

  const formatedPayload = { ...payload, exp: expiresIn };
  const encodedPayload = toBase64(formatedPayload);

  const signature = createSignature({ encodedHeader, encodedPayload, secret });

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function toBase64(target: object) {
  /**  ENCODING.
   * 1° - target is stringified.
   * 2° - String is turned to binary representation.
   * 3° - Binary rep. is transformed into base64 string.
   */
  return Buffer.from(JSON.stringify(target)).toString("base64");
}

interface SignatureCreation {
  secret: string;
  encodedHeader: string;
  encodedPayload: string;
}
export function createSignature({
  secret,
  encodedHeader,
  encodedPayload,
}: SignatureCreation) {
  return (
    crypto
      // Create an Hmac with secret.
      .createHmac("sha256", secret)
      // Feed data into the Hmac.
      .update(encodedHeader + "." + encodedPayload)
      // Format binary into a base64 string and produce final hash.
      .digest("base64")
  );
}

function parseExpiresIn(expiresIn: number | string): number {
  if (typeof expiresIn === "number") {
    // already in seconds
    return expiresIn;
  }

  // parse strings like "1h", "30m", "2d"
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(
      "Invalid format. Use a number representing seconds or a string like '1h'."
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value; // seconds
    case "m":
      return value * 60; // minutes → seconds
    case "h":
      return value * 3600; // hours → seconds
    case "d":
      return value * 86400; // days → seconds
    default:
      throw new Error(`Undefined unit ${unit}`);
  }
}

export default sign;
