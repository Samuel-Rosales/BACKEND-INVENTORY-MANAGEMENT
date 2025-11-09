import { Router } from 'express';
import { AuthController } from '../controllers';
import { authValidators } from '../validators';
import { validateFields } from '../middlewares';

const router = Router();
const controller = new AuthController(); // Instanciamos el controlador

// POST /api/auth/login
router.post(
    '/login',
    authValidators.validateLoginFields,
    validateFields,
    controller.login,
); // http://localhost:3000/api/auth/login


export const AuthRoute = router;

export default router;