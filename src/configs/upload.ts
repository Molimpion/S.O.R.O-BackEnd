// src/configs/upload.ts (CORRIGIDO)

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
// --- 1. IMPORTAR FileFilterCallback ---
import multer, { FileFilterCallback } from 'multer'; 
import { Request } from 'express';
import { ApiError } from '../errors/api-errors';
// --- 2. CORRIGIR CAMINHO (assumindo que environment.ts está em 'configs') ---
import { env } from './environment'; 

cloudinary.config({ 
  cloud_name: env.cloudinary.cloudName, 
  api_key: env.cloudinary.apiKey, 
  api_secret: env.cloudinary.apiSecret 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => { 
    return {
      folder: 'soro-midia',
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'm4v'],
    };
  },
});

const upload = multer({ 
  storage: storage,
  // --- 3. USAR O TIPO CORRETO ---
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => { 
    const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Aceita o arquivo
    } else {
      // --- 4. CORREÇÃO: Rejeita com um erro (sem o 'false') ---
      cb(new ApiError('Tipo de arquivo inválido.', 400));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
});

export default upload;