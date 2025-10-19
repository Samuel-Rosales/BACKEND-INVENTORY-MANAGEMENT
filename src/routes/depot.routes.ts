import { Router  } from "express";
import { validateFields } from "../middlewares";
import { DepotController } from "../controllers";
import { depotValidators } from "../validators";

const router = Router();
const depotController = new DepotController();

// METHOD GET
router.get("/", 
    depotController.all
); // http://localhost:3000/api/depot

router.get("/:id", 
    depotValidators.validateDepotParamIdExists,
    depotController.one,
); // http://localhost:3000/api/depot/:id

// METHOD POST
router.post("/",
    depotValidators.validateFields,
    validateFields,
    depotController.create,
); // http://localhost:3000/api/depot

//METHOD PATCH
router.patch("/:id",
    depotValidators.validateFields,
    depotValidators.validateDepotParamIdExists,
    validateFields,
    depotController.update, 
); // http://localhost:3000/api/depot/:id

//METHOD DELETE
router.delete("/:id",
    depotValidators.validateDepotParamIdExists,
    depotController.delete,
); // http://localhost:3000/api/depot/:id

export const DepotRoute = router;

export default router;