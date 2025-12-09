import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDB, RoleDB, PermissionDB } from '../models'; // Importa tu modelo User
import { UserInstance } from '../models/user.model'; // Importa tu tipo

// Augment Express Request to include `user`
declare global {
    namespace Express {
        interface Request {
            user?: UserInstance;
        }
    }
}

// Tu clave secreta (debe ser la MISMA que en auth.service)
const JWT_SECRET = process.env.JWT_SECRET || 'aq1SW2de3FR4gt5HY6ju7kI8Lo9mN0bV_unA-clave-super-secreta';

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    
    // 1. Leer el token del header
    const tokenHeader = req.header('Authorization');

    // 2. Revisar si no hay token
    if (!tokenHeader) {
        return res.status(401).json({
            message: 'No hay token en la petición. Se requiere autenticación.'
        });
    }

    // 3. Verificar si el token tiene el formato 'Bearer <token>'
    if (!tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Formato de token no válido. Debe ser "Bearer [token]".'
        });
    }

    // 4. Extraer el token (quitando "Bearer ")
    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado.'
        });
    }

    try {
        // 5. Verificar el token con la clave secreta
        // 'payload' tendrá { id, ci, role_id } que pusimos en el login
        const payload = jwt.verify(token, JWT_SECRET) as { user_ci: string, role_id: number };

        // 6. Obtener el usuario de la BD basado en el ID del payload
        //    (Usamos 'id' porque es más eficiente para buscar que 'ci')
        const user: UserInstance | null = await UserDB.findByPk(payload.user_ci, {
            include: [{
                model: RoleDB, as: 'role', include: [{
                        model: PermissionDB, as: 'permissions'
                }]
            }]
        });

        // 7. Si el usuario no existe en BD
        if (!user) {
            return res.status(401).json({
                message: 'Token no válido - usuario no existe en la base de datos.'
            });
        }

        // 8. Si el usuario está inactivo (status: false)
        if (!user.status) {
            return res.status(401).json({
                message: 'Token no válido - usuario inactivo.'
            });
        }

        // 9. ¡Éxito! Añadimos la instancia del usuario a la request
        req.user = user;

        // 10. Continuar al siguiente middleware o controlador
        next();

    } catch (error) {
        // 'error' puede ser TokenExpiredError, JsonWebTokenError, etc.
        console.error('Error al validar token:', error);
        return res.status(401).json({
            message: 'Token no válido o expirado.'
        });
    }
};