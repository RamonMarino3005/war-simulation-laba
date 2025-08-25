export type User = {
  username: string;
  email: string;
  password: string;
  id: string;
};

export type UserFields = Omit<User, "id">;

export type UserCredentials = Omit<User, "id" | "username">;
