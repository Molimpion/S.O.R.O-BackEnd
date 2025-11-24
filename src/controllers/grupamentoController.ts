import { Request, Response } from "express";
import {
  createGrupamento,
  getAllGrupamentos,
  deleteGrupamento,
} from "../services/grupamentoService";

export const create = async (req: Request, res: Response) => {
  const novoGrupamento = await createGrupamento(req.body);

  const io = req.app.get("io");
  io.emit("lista_grupamentos_atualizada", {
    action: "create",
    data: novoGrupamento,
  });

  res
    .status(201)
    .json({ message: "Grupamento criado com sucesso!", data: novoGrupamento });
};

export const getAll = async (req: Request, res: Response) => {
  const grupamentos = await getAllGrupamentos();
  res.status(200).json(grupamentos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteGrupamento(id);

  const io = req.app.get("io");
  io.emit("lista_grupamentos_atualizada", { action: "delete", data: { id } });

  res.status(200).json({ message: "Grupamento deletado com sucesso." });
};
