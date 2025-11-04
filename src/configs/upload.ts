import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { ApiError } from '../errors/api-errors';
// 1. Importa a configuração centralizada
import { env } from './environment';

// 2. Configura o Cloudinary usando o objeto 'env'
cloudinary.config({ 
  cloud_name: env.cloudinary.cloudName, 
  api_key: env.cloudinary.apiKey, 
  api_secret: env.cloudinary.apiSecret 
});

// O resto do arquivo permanece o mesmo
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'soro-midia', 
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'm4v'],
    };
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError('Tipo de arquivo inválido.', 400));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
});

export default upload;