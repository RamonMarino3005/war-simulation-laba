import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { IRefreshTokenModel } from "types/models/IRefreshTokenModel.js";

export type RefreshToken = {
  userId: string;
  token: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../db/refreshTokens.json");

export class RefreshStorage implements IRefreshTokenModel {
  private readTokens(): RefreshToken[] {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as RefreshToken[];
  }

  private writeTokens(tokens: RefreshToken[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(tokens, null, 2), "utf-8");
  }

  async save(userId: string, token: string) {
    const tokens = this.readTokens();

    const filteredTokens = tokens.filter((token) => token.userId !== userId);
    filteredTokens.push({ userId, token });

    this.writeTokens(filteredTokens);
  }

  async exists(userId: string, token: string): Promise<boolean> {
    const tokensInStorage = this.readTokens();
    const foundToken = tokensInStorage.find(
      (tok) => tok.token === token && tok.userId === userId
    );

    return !!foundToken;
  }

  async revoke(userId: string, token: string) {
    const tokensInStorage = this.readTokens();

    const filteredTokens = tokensInStorage.filter(
      (tok) => tok.userId !== userId
    );

    this.writeTokens(filteredTokens);
  }
}
