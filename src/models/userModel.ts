import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { User } from "types/userTypes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../db/mockDb.json");

export class UserModel {
  private readUsers(): User[] {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as User[];
  }

  private writeUsers(users: User[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
  }

  async getUsers(): Promise<User[]> {
    const users = this.readUsers();
    return users;
  }

  async createUser(user: Omit<User, "id">) {
    const users = this.readUsers();

    const newUser = {
      id: crypto.randomUUID(),
      ...user,
    };

    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  async findByEmail(email: string) {
    const users = this.readUsers();
    return users.find((u) => u.email === email);
  }

  async findByUsername(username: string) {
    const users = this.readUsers();
    return users.find((u) => u.username === username);
  }

  async deleteUser(userId: string) {
    const users = this.readUsers();

    const newList = users.filter((user) => userId !== user.id);

    this.writeUsers(newList);

    return true;
  }
}
