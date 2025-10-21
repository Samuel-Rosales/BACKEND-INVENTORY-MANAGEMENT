import { v2 as cloudinary } from 'cloudinary';

// Lee las variables de entorno que acabas de añadir
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Usa HTTPS
});

export default cloudinary;