import { Router  } from "express";
import { validateFields, validateJWT, checkPermission } from "../middlewares";
import { MovementController } from "../controllers";
import { movementValidators } from "../validators";

const router = Router();
const movementController = new MovementController();

//METHOD GET
router.get("/",
    //7validateJWT,
    //checkPermission("read:movements"),
    movementController.all
); // http://localhost:3000/api/movement

router.get("/:id", 
    movementValidators.validateMovementParamIdExists,
    movementController.one,
); // http://localhost:3000/api/movement/:id

router.get("/product/:product_id", 
    movementController.all
); // http://localhost:3000/api/movement/product/:product_id

//METHOD POST 
router.post("/",
    movementValidators.validateCreateFields,
    movementValidators.validateDepotIdExists,
    movementValidators.validateProductIdExists,
    validateFields,
    movementController.create,
); // http://localhost:3000/api/movement/:id

//METHOD PATCH
router.patch("/:id",
    movementValidators.validateUpdateMovementFields,
    movementValidators.validateMovementParamIdExists,
    movementValidators.validateDepotIdExists,
    movementValidators.validateProductIdExists,
    validateFields,
    movementController.update, 
); // http://localhost:3000/api/movement/:id

//METHOD DELETE
router.delete("/:id",
    movementValidators.validateMovementParamIdExists,
    movementController.delete,
); // http://localhost:3000/api/movement/:id

export const MovementRoute = router;

export default router;