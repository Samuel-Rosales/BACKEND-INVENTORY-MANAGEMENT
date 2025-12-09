import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount: any;

// Lógica Híbrida: Nube vs Local
if (process.env.FIREBASE_ADMIN_KEY) {
  // EN LA NUBE (Railway): Leemos la variable
  console.log('🔐 Usando credenciales de Firebase desde variable de entorno.');
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  } catch (error) {
    console.error('❌ Error parseando FIREBASE_ADMIN_KEY', error);
  }
} else {
  // EN LOCAL (Tu PC): Leemos el archivo
  try {
    serviceAccount = require(path.join(__dirname, 'keys/service-account-key.keys.json'));
  } catch (error) {
    console.warn('⚠️ No se encontró credencial de Firebase (ni variable ni archivo).');
  }
}

// Inicialización
if (serviceAccount) {
    // Verificamos si ya hay apps inicializadas para no duplicar
    if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
    }
}

export const messaging = admin.messaging();