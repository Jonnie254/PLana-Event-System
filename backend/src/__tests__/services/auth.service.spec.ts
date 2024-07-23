import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userLogins } from "../../interfaces/user";
import { Res } from "../../interfaces/Res";
import { loginSchema } from "../../middleware/validate.inputs";
import { AuthService } from "../../services/auth.service";

// Mocking dependencies
jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  }));
  return { PrismaClient };
});

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const mockedPrismaClient = new PrismaClient();

describe("authService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    authService.prisma = mockedPrismaClient;
    (process.env.JWT_SECRET as string) = "secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the email does not exist", async () => {
    (mockedPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await authService.login({
      email: "wrongemail@yopmail.com",
      password: "password",
    });

    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    expect(result.message).toBe("User with this email does not exist");
    expect(result.data).toBeNull();
    expect(mockedPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });

  it("should return a token for valid user login", async () => {
    const userDetails: userLogins = {
      email: "smith109@gmail.com",
      password: "userPassword",
    };

    const mockUser = {
      id: "1",
      firstname: "smith",
      lastname: "smith1",
      password: "hashedPassword",
      email: "smith109@gmail.com",
      phone: "1234567890",
      role: "user",
      profileImage: null,
      isActive: true,
      createdAt: "2024-07-22T14:24:58.059Z",
      isDeleted: false,
      isWelcome: false,
      updatedAt: "2024-07-22T14:24:58.059Z",
    };

    (mockedPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(
      mockUser
    );
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const response = await authService.login(userDetails);

    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "userPassword",
      "hashedPassword"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "1", email: "smith109@gmail.com", role: "user" },
      "secret",
      { expiresIn: "1h" }
    );
    expect(response.success).toBe(true);
    expect(response.message).toBe("User logged in successfully");
    expect(response.data).toBe("fakeToken");
    expect(mockedPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });

  it("should return an error if the user account is inactive", async () => {
    const userDetails: userLogins = {
      email: "inactiveuser@yopmail.com",
      password: "password",
    };

    const mockInactiveUser = {
      id: "2",
      firstname: "john",
      lastname: "doe",
      password: "hashedPassword",
      email: "inactiveuser@yopmail.com",
      phone: "0987654321",
      role: "user",
      profileImage: null,
      isActive: false,
      createdAt: "2024-07-22T14:24:58.059Z",
      isDeleted: false,
      isWelcome: false,
      updatedAt: "2024-07-22T14:24:58.059Z",
    };

    (mockedPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(
      mockInactiveUser
    );

    const result = await authService.login(userDetails);

    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    expect(result.message).toBe("User account is inactive");
    expect(result.data).toBeNull();
    expect(mockedPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });

  it("should return an error if the password is incorrect", async () => {
    const userDetails: userLogins = {
      email: "smith109@gmail.com",
      password: "wrongPassword",
    };

    const mockUser = {
      id: "1",
      firstname: "smith",
      lastname: "smith1",
      password: "hashedPassword",
      email: "smith109@gmail.com",
      phone: "1234567890",
      role: "user",
      profileImage: null,
      isActive: true,
      createdAt: "2024-07-22T14:24:58.059Z",
      isDeleted: false,
      isWelcome: false,
      updatedAt: "2024-07-22T14:24:58.059Z",
    };

    (mockedPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(
      mockUser
    );
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password mismatch

    const result = await authService.login(userDetails);

    expect(mockedPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword"
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid password");
    expect(result.data).toBeNull();
    expect(mockedPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });
});
