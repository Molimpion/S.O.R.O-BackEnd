import request from "supertest";
import app from "../../../src/index";

jest.mock("../../../src/services/viaturaService", () => ({
  getAllViaturas: jest.fn(),
  createViatura: jest.fn(),
  deleteViatura: jest.fn(),
}));

import * as viaturaService from "../../../src/services/viaturaService";
import { ConflictError, NotFoundError } from "../../../src/errors/api-errors";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockReturnValue({ userId: "admin-id", profile: "ADMIN" }),
}));

describe("Viatura Routes (Integration Tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ADMIN_TOKEN = "token-falso";
  const MOCK_VIATURA_ID = "550e8400-e29b-41d4-a716-446655440000";
  const mockViatura = {
    id_viatura: MOCK_VIATURA_ID,
    tipo_vt: "ABT",
    numero_viatura: "ABT-01",
    id_unidade_operacional_fk: "123e4567-e89b-12d3-a456-426614174000",
  };
  const createPayload = {
    tipo_vt: "ABT",
    numero_viatura: "ABT-01",
    id_unidade_operacional_fk: "123e4567-e89b-12d3-a456-426614174000",
  };

  it("GET /api/v1/viaturas - Deve listar viaturas (Status 200)", async () => {
    (viaturaService.getAllViaturas as jest.Mock).mockResolvedValue([
      mockViatura,
    ]);

    const res = await request(app)
      .get("/api/v1/viaturas")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockViatura]);
  });

  it("POST /api/v1/viaturas - Deve criar viatura (Status 201)", async () => {
    (viaturaService.createViatura as jest.Mock).mockResolvedValue(mockViatura);

    const res = await request(app)
      .post("/api/v1/viaturas")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send(createPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.id_viatura).toBe(MOCK_VIATURA_ID);
  });

  it("POST /api/v1/viaturas - Falha por Conflito (Status 409)", async () => {
    (viaturaService.createViatura as jest.Mock).mockRejectedValue(
      new ConflictError("Já existe uma viatura com este número.")
    );

    const res = await request(app)
      .post("/api/v1/viaturas")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send(createPayload);

    expect(res.status).toBe(409);
    expect(res.body.error).toContain("existe uma viatura");
  });

  it("DELETE /api/v1/viaturas/:id - Deve deletar (Status 200)", async () => {
    (viaturaService.deleteViatura as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .delete(`/api/v1/viaturas/${MOCK_VIATURA_ID}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(viaturaService.deleteViatura).toHaveBeenCalledWith(MOCK_VIATURA_ID);
  });

  it("DELETE /api/v1/viaturas/:id - Falha por Não Encontrado (Status 404)", async () => {
    (viaturaService.deleteViatura as jest.Mock).mockRejectedValue(
      new NotFoundError("Viatura não encontrada")
    );

    const res = await request(app)
      .delete(`/api/v1/viaturas/${MOCK_VIATURA_ID}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Viatura não encontrada");
  });
});
