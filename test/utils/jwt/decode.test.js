import { decode, sign } from "../../../src/utils/jwt/index.js";
describe("Decode", () => {
    it("Should decode the token payload", () => {
        const token = sign({ payload: { name: "Ramon" }, secret: "shhhh" });
        const decoded = decode({ token });
        expect(decoded.name).toBe("Ramon");
    });
});
