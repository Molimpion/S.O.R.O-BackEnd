import { z } from "zod";
import {
  createOcorrenciaSchema,
  listOcorrenciaSchema,
} from "../../../../src/validators/ocorrenciaValidator";

const VALID_UUID_1 = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const VALID_UUID_2 = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12";
const VALID_UUID_3 = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13";

describe("Ocorrencia Validators", () => {
  describe("createOcorrenciaSchema", () => {
    const validData = {
      data_acionamento: "2025-10-20T10:00:00Z",
      hora_acionamento: "2025-10-20T10:05:00Z",
      id_subgrupo_fk: VALID_UUID_1,
      id_bairro_fk: VALID_UUID_2,
      id_forma_acervo_fk: VALID_UUID_3,
      nr_aviso: "AV-001",
    };

    it("deve aceitar payload com todos os dados e UUIDs válidos", async () => {
      const result = await createOcorrenciaSchema.parseAsync({
        body: validData,
      });
      expect(result.body).toEqual(validData);
    });

    it("deve falhar se id_subgrupo_fk não for um UUID", async () => {
      const invalid = { ...validData, id_subgrupo_fk: "id-invalido" };
      await expect(
        createOcorrenciaSchema.parseAsync({ body: invalid })
      ).rejects.toThrow(z.ZodError);
    });

    it("deve falhar se data_acionamento não for um formato de data/hora válido", async () => {
      const invalid = { ...validData, data_acionamento: "data-errada" };
      await expect(
        createOcorrenciaSchema.parseAsync({ body: invalid })
      ).rejects.toThrow(z.ZodError);
    });
  });

  describe("listOcorrenciaSchema", () => {
    it("deve aceitar filtros de status, data e paginação corretos", async () => {
      const query = {
        status: "EM_ANDAMENTO",
        dataInicio: "2025-01-01T00:00:00Z",
        bairroId: VALID_UUID_1,
        page: "2",
        limit: "20",
      };

      const result = await listOcorrenciaSchema.parseAsync({ query });

      expect(result.query.status).toBe("EM_ANDAMENTO");

      expect(result.query.page).toBe(2);
      expect(result.query.limit).toBe(20);
    });

    it("deve falhar se o status for inválido", async () => {
      const query = { status: "STATUS_NOVO" };
      await expect(listOcorrenciaSchema.parseAsync({ query })).rejects.toThrow(
        z.ZodError
      );
    });

    it("deve aceitar números de página como string ou number", async () => {
      const query = { page: 1, limit: "10" };
      const result = await listOcorrenciaSchema.parseAsync({ query });
      expect(result.query.page).toBe(1);
    });
  });
});
