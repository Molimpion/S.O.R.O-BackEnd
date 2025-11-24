import { Request, Response } from "express";
import {
  createNatureza,
  getAllNaturezas,
  deleteNatureza,
} from "../services/naturezaService";

export async function create(req: Request, res: Response) {
  const { descricao } = req.body;
  const novaNatureza = await createNatureza(descricao);

  const io = req.app.get("io");
  io.emit("lista_naturezas_atualizada", {
    action: "create",
    data: novaNatureza,
  });

  res
    .status(201)
    .json({ message: "Natureza criada com sucesso!", data: novaNatureza });
}

export async function getAll(req: Request, res: Response) {
  const naturezas = await getAllNaturezas();
  res.status(200).json(naturezas);
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  await deleteNatureza(id);

  const io = req.app.get("io");
  io.emit("lista_naturezas_atualizada", { action: "delete", data: { id } });

  res.status(200).json({ message: "Natureza deletada com sucesso." });
}
