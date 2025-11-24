import { mockPrisma } from "../../mocks/prisma.mock";
import { registerUser } from "../../../../src/services/authService";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("senha_hash_mockada"),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve registrar um usuário e retornar sem a senha", async () => {
    const input = {
      name: "Teste",
      email: "t@t.com",
      profile: "ADMIN",
      matricula: "123",
      password: "123",
    };
    const dbUser = {
      ...input,
      id: "uuid",
      senha_hash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.user.create.mockResolvedValue(dbUser);

    const result = await registerUser(input);

    expect(result).toHaveProperty("id");
    expect(result).not.toHaveProperty("senha_hash");
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });
});
