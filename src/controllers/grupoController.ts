import { Request, Response } from 'express';
import { createGrupo, getAllGrupos, deleteGrupo } from '../services/grupoService';

export const create = async (req: Request, res: Response) => {
  const novoGrupo = await createGrupo(req.body);
  res.status(201).json({ message: 'Grupo criado com sucesso!', data: novoGrupo });
};

export const getAll = async (req: Request, res: Response) => {
  const grupos = await getAllGrupos();
  res.status(200).json(grupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteGrupo(id);
  res.status(200).json({ message: 'Grupo deletado com sucesso.' });
};