import { Request, Response } from "express";
import * as municipioService from "../services/municipioService";

export const create = async (req: Request, res: Response) => {
  const novoMunicipio = await municipioService.createMunicipio(req.body);

  const io = req.app.get("io");
  io.emit("lista_municipios_atualizada", {
    action: "create",
    data: novoMunicipio,
  });

  res.status(201).json(novoMunicipio);
};

export const getAll = async (req: Request, res: Response) => {
  const municipios = await municipioService.getAllMunicipios();
  res.status(200).json(municipios);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const municipio = await municipioService.getMunicipioById(id);
  res.status(200).json(municipio);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedMunicipio = await municipioService.updateMunicipio(id, req.body);

  const io = req.app.get("io");
  io.emit("lista_municipios_atualizada", {
    action: "update",
    data: updatedMunicipio,
  });

  res.status(200).json(updatedMunicipio);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await municipioService.deleteMunicipio(id);

  const io = req.app.get("io");
  io.emit("lista_municipios_atualizada", { action: "delete", data: { id } });

  res.status(204).send();
};
