import { Router } from "express";
import { validateFields } from "../middlewares";
import { PurchaseLotItemController } from "../controllers";
import { purchaseLotItemValidators } from "../validators";

const router = Router();
const purchaseLotItemController = new PurchaseLotItemController();

// METHOD GET
router.get("/", 
    purchaseLotItemController.all
); // http://localhost:3000/api/purchase_lot_item

router.get("/:id",
    purchaseLotItemValidators.validatePurchaseLotItemParamIdExists,
    purchaseLotItemController.one,
); // http://localhost:3000/api/purchase_lot_item/:id

// METHOD POST
router.post("/",
    purchaseLotItemValidators.validateCreateFields,
    purchaseLotItemValidators.validateProductIdExists,
    purchaseLotItemValidators.validatePurchaseIdExists,
    validateFields,
    purchaseLotItemController.create
); // http://localhost:3000/api/purchase_lot_item

//METHOD PATCH
router.patch("/:id",
    purchaseLotItemValidators.validateUpdateFields,
    purchaseLotItemValidators.validateProductIdExists,
    purchaseLotItemValidators.validatePurchaseIdExists,
    validateFields,
    purchaseLotItemController.update,
); // http://localhost:3000/api/purchase_lot_item/:id

//METHOD DELETE
router.delete("/:id", 
    purchaseLotItemValidators.validatePurchaseLotItemParamIdExists, 
    purchaseLotItemController.delete
); // http://localhost:3000/api/purchase_lot_item/:id

export  const PurchaseLotItemRoute = router;

export default router;