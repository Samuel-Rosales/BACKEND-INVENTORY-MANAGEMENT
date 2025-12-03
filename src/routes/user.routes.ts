import { Router } from "express";
import { validateFields } from "../middlewares";
import { UserController } from "../controllers";
import { userValidators } from "../validators";

const router = Router();
const userController = new UserController();

//  METHOD GET 
router.get("/", 
    userController.all
); // http://localhost:3000/api/user

router.get("/:user_ci", 
    userValidators.validateUserParamCIExists, 
    userController.one
); // http://localhost:3000/api/user/:id

router.get("/role/:role_id", 
    userController.all
); // http://localhost:3000/api/user/role/:role_id


//METHOD POST
router.post("/",
    userValidators.validateCreateFields,
    userValidators.validateRoleIdExists,
    userValidators.validateUserAlreadyExists,
    validateFields,
    userController.create
); // http://localhost:3000/api/user

//METHOD PATCH
router.patch("/:user_ci",
    userValidators.validateUpdateFields,
    userValidators.validateUserParamCIExists,
    validateFields,
    userController.update,
); // http://localhost:3000/api/product/:id

//METHOD DELETE
router.delete("/:user_ci", 
    userValidators.validateUserParamCIExists, 
    userController.delete
); // http://localhost:3000/api/product/:id

export  const UserRoute = router;

export default router;