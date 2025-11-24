import request from "supertest";
import app from "../../../src/index";

jest.mock("../../../src/services/authService", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

import * as authService from "../../../src/services/authService";
import { UnauthorizedError, ApiError } from "../../../src/errors/api-errors";

describe("Auth Routes (Integration Tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validLoginData = { email: "test@test.com", password: "Password123" };
  const mockUser = {
    id: "user-id-mock",
    email: "test@test.com",
    nome: "Test User",
  };
  const mockToken = "mock-jwt-token-valido";

  it("POST /api/v1/auth/login - Sucesso (Status 200)", async () => {
    (authService.loginUser as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(validLoginData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", mockToken);
  });

  it("POST /api/v1/auth/login - Falha (Credenciais Inválidas) (Status 401)", async () => {
    (authService.loginUser as jest.Mock).mockRejectedValue(
      new UnauthorizedError("Email ou senha inválidos")
    );

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(validLoginData);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Email ou senha inválidos");
  });

  const validRegisterData = {
    name: "Novo User",
    email: "new@user.com",
    profile: "ANALISTA",
    matricula: "M123",
  };

  it("POST /api/v1/auth/register - Sucesso (Status 201)", async () => {
    (authService.registerUser as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validRegisterData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Usuário criado com sucesso!");
  });

  it("POST /api/v1/auth/register - Falha (Erro de Serviço/E-mail) (Status 500)", async () => {
    (authService.registerUser as jest.Mock).mockRejectedValue(
      new ApiError(
        "Não foi possível criar o usuário: falha ao enviar o e-mail de confirmação.",
        500
      )
    );

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validRegisterData);

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("falha ao enviar o e-mail");
  });
});
