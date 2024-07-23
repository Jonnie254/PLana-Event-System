import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserService } from "../../services/user.service";
import { userRegister, userUpdate } from "../../interfaces/user";
import { Res } from "../../interfaces/Res";

jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn().mockImplementation(() => {
    return {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $disconnect: jest.fn(),
    };
  });
  return { PrismaClient };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

const mockedPrismaClient = new PrismaClient();
const mockUser: userRegister = {
  id: "1",
  first_name: "smith",
  last_name: "john",
  email: "smith@yopmail.com",
  password: "hashedPassword",
  phone: "1234567890",
};

const mockUpdatedUser: userUpdate = {
  firstName: "john",
  lastName: "smith",
  email: "johnsmith@yopmail.com",
  phone: "0987654321",
  profileImage: "profile.jpg",
  password: "newpassword", // Use a password to test hashing
};

const mockSingleUser = {
  id: "1",
  firstname: "smith",
  lastname: "john",
  email: "smith@yopmail.com",
  phone: "1234567890",
};

describe("UserService", () => {
  let userService: UserService;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    userService = new UserService();
    userService.prisma = mockedPrismaClient;
    (uuidv4 as jest.Mock).mockReturnValue("1");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Set up the console.error spy
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("should create a new user successfully", async () => {
    (mockedPrismaClient.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.registerUser({
      first_name: "smith",
      last_name: "john",
      email: "smith@yopmail.com",
      password: "password",
      phone: "1234567890",
    });

    expect(mockedPrismaClient.user.create).toHaveBeenCalledTimes(1);
    expect(mockedPrismaClient.user.create).toHaveBeenCalledWith({
      data: {
        id: "1",
        firstname: "smith",
        lastname: "john",
        email: "smith@yopmail.com",
        password: "hashedPassword",
        phone: "1234567890",
      },
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe("User registered successfully");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should return error if user already exists", async () => {
    const error = new Error(
      "Unique constraint failed on the constraint: `user_email_key`"
    );
    (mockedPrismaClient.user.create as jest.Mock).mockRejectedValue(error);

    const result = await userService.registerUser({
      first_name: "smith",
      last_name: "john",
      email: "smith@yopmail.com",
      password: "password",
      phone: "1234567890",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("User with the provided email already exists");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should return error if registration fails for another reason", async () => {
    const error = new Error("Some other error");
    (mockedPrismaClient.user.create as jest.Mock).mockRejectedValue(error);

    const result = await userService.registerUser({
      first_name: "smith",
      last_name: "john",
      email: "smith@yopmail.com",
      password: "password",
      phone: "1234567890",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("An error occurred while registering user");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error registering user:",
      error
    );
  });

  it("should fetch all users successfully", async () => {
    (mockedPrismaClient.user.findMany as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.getAllUsers();

    expect(mockedPrismaClient.user.findMany).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Users fetched successfully");
    expect(result.data).toEqual(mockUser);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle errors when fetching users", async () => {
    const error = new Error("Database error");
    (mockedPrismaClient.user.findMany as jest.Mock).mockRejectedValue(error);

    const result = await userService.getAllUsers();

    expect(result.success).toBe(false);
    expect(result.message).toBe("An error occurred while fetching users");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching users:",
      error
    );
  });

  it("should fetch a user by ID successfully", async () => {
    (mockedPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(
      mockSingleUser
    );

    const result = await userService.getUserById("1");

    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe("User fetched successfully");
    expect(result.data).toEqual(mockSingleUser);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle errors when fetching a user by ID", async () => {
    const error = new Error("Database error");
    (mockedPrismaClient.user.findUnique as jest.Mock).mockRejectedValue(error);

    const result = await userService.getUserById("1");

    expect(result.success).toBe(false);
    expect(result.message).toBe("An error occurred while fetching user");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching user:", error);
  });

  it("should update a user successfully", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
    (mockedPrismaClient.user.update as jest.Mock).mockResolvedValue({
      ...mockSingleUser,
      firstname: "john",
      lastname: "smith",
      email: "johnsmith@yopmail.com",
      phone: "0987654321",
      profileImage: "profile.jpg",
      password: "newHashedPassword",
    });

    const result = await userService.updateUser("1", mockUpdatedUser);

    expect(mockedPrismaClient.user.update).toHaveBeenCalledTimes(1);
    expect(mockedPrismaClient.user.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        firstname: "john",
        lastname: "smith",
        email: "johnsmith@yopmail.com",
        phone: "0987654321",
        profileImage: "profile.jpg",
        password: "newHashedPassword",
      },
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe("User updated successfully");
    expect(result.data).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle errors when updating a user", async () => {
    const error = new Error("Database error");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (mockedPrismaClient.user.update as jest.Mock).mockRejectedValue(error);

    const result = await userService.updateUser("1", mockUpdatedUser);

    expect(result.success).toBe(false);
    expect(result.message).toBe("An error occurred while updating user");
    expect(result.data).toBeNull();
  });
});
