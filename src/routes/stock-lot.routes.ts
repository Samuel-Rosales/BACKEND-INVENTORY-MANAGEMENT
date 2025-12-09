import { Router } from "express";
import { validateFields } from "../middlewares";
import { StockLotController } from "../controllers";
import { stockLotValidators } from "../validators";

const router = Router();
const stockLotController = new StockLotController();

// METHOD GET
// GET METHOD

// METHOD GET

router.get("/",
    stockLotController.all
); // http://localhost:3000/api/stock_lot


router.get("/:id",
    stockLotValidators.validateStockLotParamIdExists,
    stockLotController.one,
); // http://localhost:3000/api/stock_lot/:id


router.get("/product/:product_id",
    stockLotValidators.validateProductParamIdExists,
    stockLotController.stockLotsByProduct,
); // http://localhost:3000/api/stock_lot/product/:product_id

// METHOD POST

router.post("/",
    stockLotValidators.validateCreateFields,
    stockLotValidators.validateProductIdExists,
    stockLotValidators.validateDepotIdExists,
    validateFields,
    stockLotController.create
); // http://localhost:3000/api/stock_lot

//METHOD PATCH

router.patch("/:id",
    stockLotValidators.validateUpdateFields,
    stockLotValidators.validateProductIdExists,
    stockLotValidators.validateDepotIdExists,
    validateFields,
    stockLotController.update,
); // http://localhost:3000/api/stock_lot/:id

//METHOD DELETE

router.delete("/:id",
    stockLotValidators.validateStockLotParamIdExists,
    stockLotController.delete
); // http://localhost:3000/api/stock_lot/:id

export const StockLotRoute = router;

export default router;