import * as jwt from "./index.js";

/**
 * A generic JWT provider for signing and verifying access and refresh tokens.
 * @template T - The payload type to store in the JWT.
 */
export class JwtProvider<T extends object> {
  private accessSecret: string;
  private refreshSecret: string;

  constructor(accessSecret: string, refreshSecret: string) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
  }

  /**
   * Signs a JWT access token with a 1-day expiration.
   * @param payload - The payload to encode in the token.
   * @returns A promise resolving to the signed JWT string.
   */
  sign(payload: T): Promise<string> {
    return Promise.resolve(
      jwt.sign({
        payload,
        secret: this.accessSecret,
        options: {
          expiresIn: "1d",
        },
      })
    );
  }

  /**
   * Verifies a JWT access token.
   * @param token - The token string to verify.
   * @returns A promise resolving to the payload with expiration or null if invalid.
   */
  verify(token: string): Promise<(T & { exp: number }) | null> {
    try {
      return Promise.resolve(jwt.verify({ token, secret: this.accessSecret }));
    } catch {
      return Promise.resolve(null);
    }
  }

  /**
   * Signs a JWT refresh token with a 7-day expiration.
   * @param payload - The payload to encode in the refresh token.
   * @returns A promise resolving to the signed JWT string.
   */
  signRefreshToken(payload: T): Promise<string> {
    return Promise.resolve(
      jwt.sign({
        payload,
        secret: this.refreshSecret,
        options: {
          expiresIn: "7d",
        },
      })
    );
  }

  /**
   * Verifies a JWT refresh token.
   * @param token - The refresh token string to verify.
   * @returns A promise resolving to the payload with expiration or null if invalid.
   */
  verifyRefreshToken(token: string): Promise<(T & { exp: number }) | null> {
    try {
      return Promise.resolve(jwt.verify({ token, secret: this.refreshSecret }));
    } catch {
      return Promise.resolve(null);
    }
  }
}
