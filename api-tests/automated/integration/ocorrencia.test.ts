import request from "supertest";
import app from "../../../src/index";

jest.mock("../../../src/services/ocorrenciaService", () => ({
  createOcorrencia: jest.fn(),
}));

import * as ocorrenciaService from "../../../src/services/ocorrenciaService";

jest.mock("jsonwebtoken", () => ({
  verify: jest
    .fn()
    .mockReturnValue({ userId: "analista-id", profile: "ANALISTA" }),
}));

describe("Ocorrência Routes (Integration Tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ANALISTA_TOKEN = "token-analista";
  const MOCK_UUID_1 = "550e8400-e29b-41d4-a716-446655440000";
  const MOCK_UUID_2 = "550e8400-e29b-41d4-a716-446655440001";

  const payload = {
    data_acionamento: "2025-10-20T10:00:00.000Z",
    hora_acionamento: "2025-10-20T10:00:00.000Z",
    id_subgrupo_fk: MOCK_UUID_1,
    id_bairro_fk: MOCK_UUID_1,
    id_forma_acervo_fk: MOCK_UUID_2,
    nr_aviso: "AV-TESTE",
  };

  it("POST /api/v1/ocorrencias - Deve criar ocorrencia (Status 201)", async () => {
    const mockOcorrencia = { id_ocorrencia: "nova-ocorrencia-id", ...payload };
    (ocorrenciaService.createOcorrencia as jest.Mock).mockResolvedValue(
      mockOcorrencia
    );

    const res = await request(app)
      .post("/api/v1/ocorrencias")
      .set("Authorization", `Bearer ${ANALISTA_TOKEN}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.id_ocorrencia).toBe("nova-ocorrencia-id");

    expect(ocorrenciaService.createOcorrencia).toHaveBeenCalledWith(
      payload,
      "analista-id"
    );
  });
});
