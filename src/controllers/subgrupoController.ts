import { Request, Response } from "express";
import {
  createSubgrupo,
  getAllSubgrupos,
  deleteSubgrupo,
} from "../services/subgrupoService";

export const create = async (req: Request, res: Response) => {
  const novoSubgrupo = await createSubgrupo(req.body);

  const io = req.app.get("io");
  io.emit("lista_subgrupos_atualizada", {
    action: "create",
    data: novoSubgrupo,
  });

  res
    .status(201)
    .json({ message: "Subgrupo criado com sucesso!", data: novoSubgrupo });
};

export const getAll = async (req: Request, res: Response) => {
  const filtros = {
    grupoId: req.query.grupoId as string,
  };
  const subgrupos = await getAllSubgrupos(filtros);

  res.status(200).json(subgrupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSubgrupo(id);

  const io = req.app.get("io");
  io.emit("lista_subgrupos_atualizada", { action: "delete", data: { id } });

  res.status(200).json({ message: "Subgrupo deletado com sucesso." });
};
