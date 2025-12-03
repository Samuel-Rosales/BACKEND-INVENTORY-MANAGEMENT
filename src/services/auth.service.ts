import jwt from 'jsonwebtoken';
import { UserDB } from '../models'; // Asumo que UserDB es tu modelo User
import { UserInstance } from '../models/user.model'; // Tu tipo de instancia
import { AuthInterface } from '../interfaces'; // Deberías crear esta interfaz

// (Asegúrate de tener JWT_SECRET en tu .env)
const JWT_SECRET = process.env.JWT_SECRET || 'aq1SW2de3FR4gt5HY6ju7kI8Lo9mN0bV_unA-clave-super-secreta';

class AuthService {

    async login(loginData: AuthInterface) {
        const { user_ci, password } = loginData;

        try {
            // 2. Buscar al usuario por su CI
            const user: UserInstance | null = await UserDB.findOne({ where: { user_ci } });

            // 3. Si no existe, error genérico
            if (!user) {
                return {
                    status: 401,
                    message: 'CI o contraseña incorrectos.',
                    data: null
                };
            }

            // 4. Validar el password usando tu método de instancia
            const isPasswordValid = await user.validatePassword(password);

            if (!isPasswordValid) {
                return {
                    status: 401,
                    message: 'CI o contraseña incorrectos.',
                    data: null
                };
            }
            
            // 5. Verificar si el usuario está activo
            if (user.status === false) {
                 return {
                    status: 403,
                    message: 'El usuario está inactivo.',
                    data: null
                };
            }

            // 6. ¡Éxito! Generar el JSON Web Token (JWT)
            const payload = {
                user_ci: user.user_ci,
                role_id: user.role_id
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

            // 7. Enviar la respuesta exitosa
            return {
                status: 200,
                message: 'Autenticación exitosa',
                data: {
                    token,
                    user: {
                        user_ci: user.user_ci,
                        name: user.name,
                        role_id: user.role_id
                    }
                }
            };

        } catch (error) {
            console.error("Error en login service: ", error);
            return {
                status: 500,
                message: 'Error inesperado en el servidor',
                data: null
            };
        }
    }
}

export const AuthServices = new AuthService();