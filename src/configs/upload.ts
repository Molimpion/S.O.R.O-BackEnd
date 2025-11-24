import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "../errors/api-errors";
import { env } from "./environment";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "soro-midia",
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "m4v"],
    };
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/quicktime",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError("Tipo de arquivo inválido.", 400));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

export default upload;
