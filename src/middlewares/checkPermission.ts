import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar si el usuario tiene un permiso específico.
 * DEBE ejecutarse DESPUÉS de validateJWT.
 *
 * @param requiredPermission El 'name' del permiso requerido (ej. 'delete:user')
 */
export const checkPermission = (requiredPermission: string) => {
    
    return (req: Request, res: Response, next: NextFunction) => {
        
        // 1. Validar que req.user y sus permisos existan
        if (!req.user || !req.user.rol || !req.user.rol.permissions) {
            return res.status(500).json({
                message: 'Error de servidor: Datos de usuario no cargados en la request.'
            });
        }

        // 2. Obtener la lista de permisos del usuario (que cargamos en validateJWT)
        // (req.user.rol.permissions es un array [{name: '...'}, {name: '...'}])
        const userPermissions = req.user.rol.permissions.map(perm => perm.code);
        console.log("Permisos del usuario:", userPermissions);

        // 3. Verificar si el permiso requerido está en la lista
        if (userPermissions.includes(requiredPermission)) {
            // ¡Autorizado! Continuar a la ruta
            next(); 
        } else {
            // ¡No autorizado!
            return res.status(403).json({
                message: `Acceso denegado. Se requiere el permiso: [${requiredPermission}]`,
            });
        }
    };
};