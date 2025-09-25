export interface IRefreshTokenModel {
  save(userId: string, token: string): Promise<void>;
  exists(userId: string, token: string): Promise<boolean>;
  revoke(userId: string, token: string): Promise<void>;
}
