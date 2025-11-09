import { Router } from "express";
import { validateFields } from "../middlewares";
import { PermissionController } from "../controllers";
import { permissionValidators } from "../validators";

const router = Router();
const controller = new PermissionController();

//  METHOD GET
router.get("/", 
    controller.all
); // http://localhost:3000/api/permission

router.get("/:id",
    permissionValidators.validatePermissionParamIdExists,
    controller.one,
); // http://localhost:3000/api/permission/:id

//METHOD POST
router.post("/",
    permissionValidators.validateCreateFields,
    validateFields,
    controller.create
); // http://localhost:3000/api/permission

//METHOD PATCH
router.patch("/:id",
    permissionValidators.validateUpdateFields,
    permissionValidators.validatePermissionParamIdExists,
    validateFields,
    controller.update,
); // http://localhost:3000/api/permission/:id

//METHOD DELETE
router.delete("/:id", 
    permissionValidators.validatePermissionParamIdExists, 
    controller.delete
); // http://localhost:3000/api/permission/:id

export  const PermissionRoute = router;

export default router;