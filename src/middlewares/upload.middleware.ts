// src/middlewares/upload.middleware.ts
import multer from 'multer';

// Configura multer para que guarde los archivos en memoria
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });