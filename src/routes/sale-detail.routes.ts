import { Router } from "express";
import { validateFields } from "../middlewares";
import { SaleDetailController } from "../controllers";
import { saleDetailValidators } from "../validators";

const router = Router();
const saledetailController = new SaleDetailController();

// METHOD GET
router.get("/", 
    saledetailController.all
); // http://localhost:3000/api/sale_detail

router.get("/:id",
    saleDetailValidators.validateSaleDetailParamIdExists,
    saledetailController.one,
); // http://localhost:3000/api/sale_detail/:id

// METHOD POST
router.post("/",
    saleDetailValidators.validateCreateFields,
    saleDetailValidators.validateProductIdExists,
    saleDetailValidators.validateSaleIdExists,
    validateFields,
    saledetailController.create
); // http://localhost:3000/api/sale_detail

//METHOD PATCH
router.patch("/:id",
    saleDetailValidators.validateUpdateFields,
    saleDetailValidators.validateProductIdExists,
    saleDetailValidators.validateSaleIdExists,
    validateFields,
    saledetailController.update,
); // http://localhost:3000/api/sale_detail/:id

//METHOD DELETE
router.delete("/:id", 
    saleDetailValidators.validateSaleDetailParamIdExists, 
    saledetailController.delete
); // http://localhost:3000/api/sale_detail/:id

export  const SaleDetailRoute = router;

export default router;