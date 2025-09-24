export type User = {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  user_id: string;
};

export type UserFields = Omit<User, "user_id">;

export type UserCredentials = Omit<User, "user_id" | "username" | "role">;

export type PublicUser = Omit<User, "password">;

export type StoredUser = Omit<User, "password"> & { password_hash: string };

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};
