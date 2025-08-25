import { verify, sign } from "../../../src/utils/jwt/index.js";
describe("verify", () => {
    const secret = "shhhh";
    it("should verify and decode a valid token", () => {
        const token = sign({ payload: { name: "Ramon" }, secret });
        const verified = verify({ token, secret });
        expect(verified.name).toBe("Ramon");
    });
    it("should throw if the signature is invalid", () => {
        const alternativeSecret = "SecretTwo";
        const token = sign({ payload: { name: "Ramon" }, secret });
        try {
            verify({ token, secret: alternativeSecret });
        }
        catch (e) {
            expect(e.message).toBe("Invalid signature");
        }
    });
    it("should throw if the token has expired", () => {
        const token = sign({
            payload: { name: "Ramon" },
            secret,
            options: { expiresIn: -86400 },
        });
        try {
            verify({ token, secret });
        }
        catch (e) {
            expect(e.message).toBe("Token has expired");
        }
    });
});
