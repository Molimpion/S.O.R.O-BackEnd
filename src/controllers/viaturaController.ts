import { Request, Response } from 'express';
// --- AGORA ESTE IMPORT FUNCIONA ---
import { createViatura, getAllViaturas, deleteViatura, updateViatura } from '../services/viaturaService';

export async function create(req: Request, res: Response) {
  const novaViatura = await createViatura(req.body);
  res.status(201).json({ message: 'Viatura criada com sucesso!', data: novaViatura });
};

export async function getAll(req: Request, res: Response) {
  const viaturas = await getAllViaturas();
  res.status(200).json(viaturas);
};

// --- Rota de Update (para PUT e PATCH) ---
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const updatedViatura = await updateViatura(id, req.body);
  res.status(200).json({ message: 'Viatura atualizada com sucesso!', data: updatedViatura });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  await deleteViatura(id);
  res.status(200).json({ message: 'Viatura deletada com sucesso.' });
};