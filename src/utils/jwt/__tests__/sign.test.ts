import { fromBase64 } from "../decode.js";
import { sign } from "../index.js";

describe("sign", () => {
  const secret = "shhhh";

  it("should create different signatures for different secrets", () => {
    const jwt_1 = sign({
      payload: { name: "Ramon" },
      secret,
      options: { expiresIn: 8.64e7 },
    }).split(".")[2];

    const jwt_2 = sign({
      payload: { name: "Ramon" },
      secret: `${secret}-123`,
      options: { expiresIn: 8.64e7 },
    }).split(".")[2];

    expect(jwt_1).not.toBe(jwt_2);
  });

  it("should add the expiry to the payload", () => {
    const testJwt = sign({
      payload: { name: "Ramon" },
      secret,
      options: { expiresIn: 8.64e7 },
    }).split(".")[1];

    expect(typeof JSON.parse(fromBase64(testJwt)).exp).toBe("number");
  });
});
