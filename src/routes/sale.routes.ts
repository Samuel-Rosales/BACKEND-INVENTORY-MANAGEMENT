import { Router } from "express";
import { validateFields, validateJWT, checkPermission } from "../middlewares";
import { SaleController } from "../controllers";
import { saleValidators } from "../validators";

const router = Router();
const saleController = new SaleController();

// METHOD GET
/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         sale_id:
 *           type: integer
 *           description: ID auto-generado de la venta
 *         client_ci:
 *           type: string
 *           description: Cédula del cliente
 *         user_ci:
 *           type: string
 *           description: Cédula del usuario (vendedor)
 *         type_payment_id:
 *           type: integer
 *           description: ID del tipo de pago
 *         total_usd:
 *           type: number
 *           description: Total de la venta en USD
 *         exchange_rate:
 *           type: number
 *           description: Tasa de cambio aplicada
 *         total_ves:
 *           type: number
 *           description: Total de la venta en Bolívares
 *         sold_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la venta
 *         status:
 *           type: boolean
 *           description: Estado de la venta
 *       example:
 *         sale_id: 1001
 *         client_ci: "12345678"
 *         user_ci: "87654321"
 *         type_payment_id: 1
 *         total_usd: 50.00
 *         exchange_rate: 36.50
 *         total_ves: 1825.00
 *         sold_at: "2023-10-27T10:00:00Z"
 *         status: true
 *     SaleItemInput:
 *       type: object
 *       required:
 *         - product_id
 *         - depot_id
 *         - amount
 *       properties:
 *         product_id:
 *           type: integer
 *           description: ID del producto a vender
 *         depot_id:
 *           type: integer
 *           description: ID del almacén de origen
 *         amount:
 *           type: integer
 *           description: Cantidad a vender
 *       example:
 *         product_id: 101
 *         depot_id: 1
 *         amount: 2
 */

// METHOD GET

router.get("/",
    saleController.all
); // http://localhost:3000/api/sale


router.get("/:id",
    saleValidators.validateSaleParamIdExists,
    saleController.one,
); // http://localhost:3000/api/sale/:id

// METHOD POST

router.post("/",
    //validateJWT,
    //checkPermission("create:sale"),
    saleValidators.validateCreateFields,
    saleValidators.validateClientCIExists,
    saleValidators.validateUserCIExists,
    saleValidators.validateTypePaymentIdExists,
    validateFields,
    saleController.create
); // http://localhost:3000/api/sale

//METHOD PATCH
/**
 * @swagger
 * /sale/{id}:
 *   patch:
 *     summary: Actualizar una venta existente
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_ci:
 *                 type: string
 *               user_ci:
 *                 type: string
 *               type_payment_id:
 *                 type: integer
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Venta actualizada
 */
router.patch("/:id",
    saleValidators.validateUpdateFields,
    saleValidators.validateClientCIExists,
    saleValidators.validateUserCIExists,
    saleValidators.validateTypePaymentIdExists,
    validateFields,
    saleController.update,
); // http://localhost:3000/api/sale/:id

//METHOD DELETE

router.delete("/:id",
    saleValidators.validateSaleParamIdExists,
    saleController.delete
); // http://localhost:3000/api/type_payment/:id

export const SaleRoute = router;

export default router;