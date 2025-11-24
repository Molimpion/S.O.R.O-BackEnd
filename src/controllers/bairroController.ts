import { Request, Response } from "express";
import * as bairroService from "../services/bairroService";

export const create = async (req: Request, res: Response) => {
  const novoBairro = await bairroService.createBairro(req.body);

  const io = req.app.get("io");
  io.emit("lista_bairros_atualizada", { action: "create", data: novoBairro });

  res.status(201).json(novoBairro);
};

export const getAll = async (req: Request, res: Response) => {
  const bairros = await bairroService.getAllBairros();
  res.status(200).json(bairros);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const bairro = await bairroService.getBairroById(id);
  res.status(200).json(bairro);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedBairro = await bairroService.updateBairro(id, req.body);

  const io = req.app.get("io");
  io.emit("lista_bairros_atualizada", {
    action: "update",
    data: updatedBairro,
  });

  res.status(200).json(updatedBairro);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await bairroService.deleteBairro(id);

  const io = req.app.get("io");
  io.emit("lista_bairros_atualizada", { action: "delete", data: { id } });

  res.status(204).send();
};
