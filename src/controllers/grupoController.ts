import { Request, Response } from "express";
import {
  createGrupo,
  getAllGrupos,
  deleteGrupo,
} from "../services/grupoService";

export const create = async (req: Request, res: Response) => {
  const novoGrupo = await createGrupo(req.body);

  const io = req.app.get("io");
  io.emit("lista_grupos_atualizada", { action: "create", data: novoGrupo });

  res
    .status(201)
    .json({ message: "Grupo criado com sucesso!", data: novoGrupo });
};

export const getAll = async (req: Request, res: Response) => {
  const filtros = {
    naturezaId: req.query.naturezaId as string,
  };
  const grupos = await getAllGrupos(filtros);

  res.status(200).json(grupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteGrupo(id);

  const io = req.app.get("io");
  io.emit("lista_grupos_atualizada", { action: "delete", data: { id } });

  res.status(200).json({ message: "Grupo deletado com sucesso." });
};
