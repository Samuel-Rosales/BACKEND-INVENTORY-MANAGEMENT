import { Router } from 'express';
import { ExchangeRateController } from '../controllers';

const router = Router();
const controller = new ExchangeRateController(); // Instanciamos el controlador

// GET
router.get(
    '/current_rate',
    controller.currentRate,
); // http://localhost:3000/api/exchange_rate/current_rate

export const ExchangeRateRoute = router;

export default router;