import { Router } from "express";
import { validateFields } from "../middlewares";
import { StockGeneralController } from "../controllers";
import { stockgeneralValidators } from "../validators";

const router = Router();
const stockGeneralController = new StockGeneralController();

// METHOD GET
// METHOD GET

// METHOD GET

router.get("/",
    stockGeneralController.all
); // http://localhost:3000/api/general_stock


router.get("/:product_id/:depot_id",
    stockgeneralValidators.validateStockGeneralParamIdExists,
    stockGeneralController.one,
); // http://localhost:3000/api/general_stock/:product_id/:depot_id

// METHOD POST

router.post("/",
    stockgeneralValidators.validateCreateFields,
    stockgeneralValidators.validateProductIdExists,
    stockgeneralValidators.validateDepotIdExists,
    validateFields,
    stockGeneralController.create
); // http://localhost:3000/api/general_stock

//METHOD PATCH

router.patch("/:product_id/:depot_id",
    stockgeneralValidators.validateUpdateFields,
    stockgeneralValidators.validateProductIdExists,
    stockgeneralValidators.validateDepotIdExists,
    validateFields,
    stockGeneralController.update,
); // http://localhost:3000/api/general_stock/:product_id/:depot_id

//METHOD DELETE

router.delete("/:product_id/:depot_id",
    stockgeneralValidators.validateStockGeneralParamIdExists,
    stockGeneralController.delete
); // http://localhost:3000/api/general_stock/:product_id/:depot_id

export const StockGeneralRoute = router;

export default router;