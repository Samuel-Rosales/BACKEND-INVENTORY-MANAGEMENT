import { Router } from "express";
import { validateFields } from "../middlewares";
import { RolController } from "../controllers";
import { rolValidators } from "../validators";

const router = Router();
const rolController = new RolController();

//  METHOD GET
router.get("/", 
    rolController.all
); // http://localhost:3000/api/rol

router.get("/:id",
    rolValidators.validateRolParamIdExists,
    rolController.one,
); // http://localhost:3000/api/rol/:id

router.get("/user/:user_id", 
    rolController.all
); // http://localhost:3000/api/rol/user/:user_id

//METHOD POST
router.post("/",
    rolValidators.validateFields,
    validateFields,
    rolController.create
); // http://localhost:3000/api/rol

//METHOD PATCH
router.patch("/:id",
    rolValidators.validateFields,
    rolValidators.validateRolParamIdExists,
    validateFields,
    rolController.update,
); // http://localhost:3000/api/rol/:id

//METHOD DELETE
router.delete("/:id", 
    rolValidators.validateRolParamIdExists, 
    rolController.delete
); // http://localhost:3000/api/rol/:id

export  const RolRoute = router;

export default router;