import { z } from 'zod';
import { registerSchema, loginSchema } from '../../../../src/validators/authValidator';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('deve aceitar um payload de registro válido', async () => {
      const data = {
        name: 'Bombeiro Teste',
        email: 'teste@bombeiros.pe.gov.br',
        profile: 'ANALISTA',
        matricula: '123456-0'
      };
      const result = await registerSchema.parseAsync({ body: data });
      expect(result.body).toEqual(data);
    });

    it('deve falhar com email inválido', async () => {
      const data = { name: 'B', email: 'email-ruim', profile: 'ADMIN', matricula: '123' };
      await expect(registerSchema.parseAsync({ body: data })).rejects.toThrow(z.ZodError);
    });
  });
});