import { mockPrisma } from "../../mocks/prisma.mock";
import {
  createBairro,
  deleteBairro,
} from "../../../../src/services/bairroService";
import {
  NotFoundError,
  ConflictError,
} from "../../../../src/errors/api-errors";

describe("BairroService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createBairro: deve falhar se município associado não existir", async () => {
    mockPrisma.municipio.findUnique.mockResolvedValue(null);

    await expect(
      createBairro({
        nome_bairro: "Boa Viagem",
        id_municipio_fk: "id-inexistente",
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("deleteBairro: deve impedir deleção se estiver em uso", async () => {
    mockPrisma.bairro.findUnique.mockResolvedValue({ id: "bairro-id" });

    mockPrisma.ocorrencia.findFirst.mockResolvedValue({ id: "ocorrencia-id" });

    await expect(deleteBairro("bairro-id")).rejects.toThrow(ConflictError);
  });
});
