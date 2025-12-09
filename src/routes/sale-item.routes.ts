import { Router } from "express";
import { validateFields } from "../middlewares";
import { SaleItemController } from "../controllers";
import { saleItemValidators } from "../validators";

const router = Router();
const saleItemController = new SaleItemController();

// METHOD GET

router.get("/",
    saleItemController.all
); // http://localhost:3000/api/sale_item


router.get("/:id",
    saleItemValidators.validateSaleItemParamIdExists,
    saleItemController.one,
); // http://localhost:3000/api/sale_item/:id

// METHOD POST

router.post("/",
    saleItemValidators.validateCreateFields,
    saleItemValidators.validateProductIdExists,
    saleItemValidators.validateSaleIdExists,
    validateFields,
    saleItemController.create
); // http://localhost:3000/api/sale_item

//METHOD PATCH

router.patch("/:id",
    saleItemValidators.validateUpdateFields,
    saleItemValidators.validateProductIdExists,
    saleItemValidators.validateSaleIdExists,
    validateFields,
    saleItemController.update,
); // http://localhost:3000/api/sale_item/:id

//METHOD DELETE

router.delete("/:id",
    saleItemValidators.validateSaleItemParamIdExists,
    saleItemController.delete
); // http://localhost:3000/api/sale_item/:id

export const SaleItemRoute = router;

export default router;