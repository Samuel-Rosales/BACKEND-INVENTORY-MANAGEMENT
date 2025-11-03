import { Router } from "express";
import { validateFields } from "../middlewares";
import { PurchaseGeneralItemController } from "../controllers";
import { purchaseGeneralItemValidators } from "../validators";

const router = Router();
const purchaseGeneralItemController = new PurchaseGeneralItemController();

// METHOD GET
router.get("/", 
    purchaseGeneralItemController.all
); // http://localhost:3000/api/purchase_general_item

router.get("/:id",
    purchaseGeneralItemValidators.validatePurchaseGeneralItemParamIdExists,
    purchaseGeneralItemController.one,
); // http://localhost:3000/api/purchase_general_item/:id

// METHOD POST
router.post("/",
    purchaseGeneralItemValidators.validateCreateFields,
    purchaseGeneralItemValidators.validateProductIdExists,
    purchaseGeneralItemValidators.validatePurchaseIdExists,
    purchaseGeneralItemValidators.validateDepotIdExists,
    validateFields,
    purchaseGeneralItemController.create
); // http://localhost:3000/api/purchase_general_item

//METHOD PATCH
router.patch("/:id",
    purchaseGeneralItemValidators.validateUpdateFields,
    purchaseGeneralItemValidators.validateProductIdExists,
    purchaseGeneralItemValidators.validatePurchaseIdExists,
    purchaseGeneralItemValidators.validateDepotIdExists,
    validateFields,
    purchaseGeneralItemController.update,
); // http://localhost:3000/api/purchase_general_item/:id

//METHOD DELETE
router.delete("/:id", 
    purchaseGeneralItemValidators.validatePurchaseGeneralItemParamIdExists, 
    purchaseGeneralItemController.delete
); // http://localhost:3000/api/purchase_general_item/:id

export  const PurchaseGeneralItemRoute = router;

export default router;