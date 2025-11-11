import { Router } from "express";
import { validateFields, validateJWT, checkPermission } from "../middlewares";
import { SaleController } from "../controllers";
import { saleValidators } from "../validators";

const router = Router();
const saleController = new SaleController();

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

export  const SaleRoute = router;

export default router;