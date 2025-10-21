import { Router } from "express";
import { validateFields } from "../middlewares";
import { PurchaseDetailController } from "../controllers";
import { purchaseDetailValidators } from "../validators";

const router = Router();
const purchasedetailController = new PurchaseDetailController();

// METHOD GET
router.get("/", 
    purchasedetailController.all
); // http://localhost:3000/api/purchase_detail

router.get("/:id",
    purchaseDetailValidators.validatePurchaseDetailParamIdExists,
    purchasedetailController.one,
); // http://localhost:3000/api/purchase_detail/:id

// METHOD POST
router.post("/",
    purchaseDetailValidators.validateCreateFields,
    purchaseDetailValidators.validateProductIdExists,
    purchaseDetailValidators.validatePurchaseIdExists,
    validateFields,
    purchasedetailController.create
); // http://localhost:3000/api/purchase_detail

//METHOD PATCH
router.patch("/:id",
    purchaseDetailValidators.validateUpdateFields,
    purchaseDetailValidators.validateProductIdExists,
    purchaseDetailValidators.validatePurchaseIdExists,
    validateFields,
    purchasedetailController.update,
); // http://localhost:3000/api/purchase_detail/:id

//METHOD DELETE
router.delete("/:id", 
    purchaseDetailValidators.validatePurchaseDetailParamIdExists, 
    purchasedetailController.delete
); // http://localhost:3000/api/purchase_detail/:id

export  const PurchaseDetailRoute = router;

export default router;