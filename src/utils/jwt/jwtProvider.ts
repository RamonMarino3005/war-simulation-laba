import * as jwt from "./index.js";

export class JwtProvider<T extends object> {
  private accessSecret: string;
  private refreshSecret: string;

  constructor(accessSecret: string, refreshSecret: string) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
  }

  sign(payload: T): Promise<string> {
    return Promise.resolve(
      jwt.sign({
        payload,
        secret: this.accessSecret,
        options: {
          expiresIn: "7d",
        },
      })
    );
  }

  verify(token: string): Promise<(T & { exp: number }) | null> {
    try {
      return Promise.resolve(jwt.verify({ token, secret: this.accessSecret }));
    } catch {
      return Promise.resolve(null);
    }
  }

  signRefreshToken(payload: T): Promise<string> {
    return Promise.resolve(
      jwt.sign({
        payload,
        secret: this.refreshSecret,
        options: {
          expiresIn: "1d",
        },
      })
    );
  }

  verifyRefreshToken(token: string): Promise<(T & { exp: number }) | null> {
    try {
      return Promise.resolve(jwt.verify({ token, secret: this.refreshSecret }));
    } catch {
      return Promise.resolve(null);
    }
  }
}
