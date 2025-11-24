// api-tests/automated/integration/genericCrud.test.ts

import request from 'supertest';
import app from '../../../src/index';

// MOCKANDO O SERVIÇO DE NATUREZA
jest.mock('../../../src/services/naturezaService', () => ({
  getAllNaturezas: jest.fn(),
  createNatureza: jest.fn(),
  deleteNatureza: jest.fn(),
}));

import * as naturezaService from '../../../src/services/naturezaService';
import { ConflictError } from '../../../src/errors/api-errors';

// Mock de autenticação (permanece o mesmo, simula um ADMIN)
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn().mockReturnValue({ userId: 'admin-id', profile: 'ADMIN' }),
}));

// Definições genéricas
const ENTITY_ID = '550e8400-e29b-41d4-a716-446655440003';
const PAYLOAD = { descricao: 'TESTE NATUREZA' };
const MOCK_NATUREZA = { id_natureza: ENTITY_ID, ...PAYLOAD };
const ROUTE = '/api/v1/naturezas';
const ADMIN_TOKEN = 'token-falso';

describe(`CRUD Integration: ${ROUTE}`, () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET / - Deve listar itens (Status 200)', async () => {
    (naturezaService.getAllNaturezas as jest.Mock).mockResolvedValue([MOCK_NATUREZA]);

    const res = await request(app)
      .get(ROUTE)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([MOCK_NATUREZA]);
  });

  it('POST / - Deve criar item (Status 201)', async () => {
    (naturezaService.createNatureza as jest.Mock).mockResolvedValue(MOCK_NATUREZA);

    const res = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send(PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data.descricao).toBe(PAYLOAD.descricao);
  });
  
  it('POST / - Deve retornar 409 em caso de Conflito', async () => {
    (naturezaService.createNatureza as jest.Mock).mockRejectedValue(
        new ConflictError('Natureza já existe.')
    );
    
    const res = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send(PAYLOAD);
      
    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Natureza já existe');
  });

  it('DELETE /:id - Deve deletar item (Status 200)', async () => {
    (naturezaService.deleteNatureza as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .delete(`${ROUTE}/${ENTITY_ID}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(naturezaService.deleteNatureza).toHaveBeenCalledWith(ENTITY_ID);
  });
});