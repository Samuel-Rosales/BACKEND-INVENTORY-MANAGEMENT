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

router.get("/:id", 
    userValidators.validateUserParamIdExists, 
    userController.one
); // http://localhost:3000/api/user/:id

router.get("/rol/:rol_id", 
    userController.all
); // http://localhost:3000/api/user/rol/:rol_id


//METHOD POST
router.post("/",
    userValidators.validateCreateFields,
    userValidators.validateUserParamIdExists,
    validateFields,
    userController.create
); // http://localhost:3000/api/user

//METHOD PATCH
router.patch("/:id",
    userValidators.validateUpdateFields,
    userValidators.validateUserParamIdExists,
    validateFields,
    userController.update,
); // http://localhost:3000/api/product/:id

//METHOD DELETE
router.delete("/:id", 
    userValidators.validateUserParamIdExists, 
    userController.delete
); // http://localhost:3000/api/product/:id

export  const UserRoute = router;

export default router;