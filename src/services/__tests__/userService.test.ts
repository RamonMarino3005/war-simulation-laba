// src/services/__tests__/userService.test.ts
import { StoredUser } from "types/entities/userTypes.js";
import { UserService } from "../userService.js";

describe("UserService", () => {
  let userModelMock: any;
  let service: UserService;

  const userMock: StoredUser = {
    user_id: "123",
    username: "testuser",
    email: "test@example.com",
    role: "user",
    password_hash: "hashedpassword",
  };

  beforeEach(() => {
    userModelMock = {
      getUsers: jest.fn(),
      findById: jest.fn(),
      deleteUser: jest.fn(),
    };

    service = new UserService(userModelMock);
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      userModelMock.getUsers.mockResolvedValue([userMock]);

      const result = await service.getUsers();
      expect(result).toEqual([userMock]);
      expect(userModelMock.getUsers).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return public user data if found", async () => {
      userModelMock.findById.mockResolvedValue(userMock);

      const result = await service.getUserById("123");
      expect(result).toEqual({
        user_id: "123",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      });
    });

    it("should return null if user not found", async () => {
      userModelMock.findById.mockResolvedValue(null);

      const result = await service.getUserById("1");
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete user by id", async () => {
      userModelMock.deleteUser.mockResolvedValue(true);

      const result = await service.delete({ userId: "123" });
      expect(result).toBe(true);
      expect(userModelMock.deleteUser).toHaveBeenCalledWith("123");
    });
  });
});
