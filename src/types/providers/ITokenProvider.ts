import { Payload, SignedPayload } from "types/services/IAuthService.js";

export interface ITokenProvider {
  sign(payload: Payload): Promise<string>;
  verify(token: string): Promise<SignedPayload | null>;
  signRefreshToken(payload: Payload): Promise<string>;
  verifyRefreshToken(token: string): Promise<SignedPayload | null>;
}
