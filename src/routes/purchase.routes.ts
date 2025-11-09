import { Router } from "express";
import { validateFields, validateJWT, checkPermission} from "../middlewares";
import { PurchaseController } from "../controllers";
import { purchaseValidators } from "../validators";

const router = Router();
const purchaseController = new PurchaseController();

// METHOD GET
router.get("/", 
    purchaseController.all
); // http://localhost:3000/api/purchase

router.get("/:id",
    purchaseValidators.validatePurchaseParamIdExists,
    purchaseController.one,
); // http://localhost:3000/api/purchase/:id

// METHOD POST
router.post("/",
    validateJWT,
    checkPermission("create:sale"),
    purchaseValidators.validateCreateFields,
    purchaseValidators.validateProviderIdExists,
    purchaseValidators.validateUserCIExists,
    purchaseValidators.validateTypePaymentIdExists,
    validateFields,
    purchaseController.create
); // http://localhost:3000/api/purchase

//METHOD PATCH
router.patch("/:id",
    purchaseValidators.validateUpdateFields,
    purchaseValidators.validateProviderIdExists,
    purchaseValidators.validateUserCIExists,
    purchaseValidators.validateTypePaymentIdExists,
    validateFields,
    purchaseController.update,
); // http://localhost:3000/api/purchase/:id

//METHOD DELETE
router.delete("/:id", 
    purchaseValidators.validatePurchaseParamIdExists, 
    purchaseController.delete
); // http://localhost:3000/api/type_payment/:id

export  const PurchaseRoute = router;

export default router;