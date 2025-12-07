import admin from 'firebase-admin';
import path from 'path';

// Asegúrate de poner tu archivo JSON en una carpeta segura, ej: src/config/keys/
// O usa variables de entorno para producción.
const serviceAccount = require(path.join(__dirname, 'keys/service-account-key.keys.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const messaging = admin.messaging();