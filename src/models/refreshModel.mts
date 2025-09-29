import { IRefreshTokenModel } from "types/models/IRefreshTokenModel.js";
import { RedisClient } from "db/Redis/index.js";

export type RefreshToken = {
  userId: string;
  token: string;
};

export class RefreshStorage implements IRefreshTokenModel {
  constructor(private redisClient: RedisClient) {}

  async save(userId: string, token: string) {
    await this.redisClient.set(userId, token);
  }

  async exists(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redisClient.get<string>(userId);
    return storedToken === token;
  }

  async revoke(userId: string, token: string) {
    await this.redisClient.del(userId);
  }
}
