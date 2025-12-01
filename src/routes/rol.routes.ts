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

router.get("/:id/permissions",
    rolValidators.validateRolParamIdExists,
    rolController.getPermissionsByRolId,
); // http://localhost:3000/api/rol/:id/permissions

//METHOD POST
router.post("/",
    rolValidators.validateFields,
    validateFields,
    rolController.create
); // http://localhost:3000/api/rol

//MeTHOD PUT
router.patch("/:id/assign_permissions",
    rolValidators.validateFields,
    validateFields,
    rolController.assignPermissions
); // http://localhost:3000/api/rol/:id/assign_permissions

router.patch("/:id/remove_permissions",
    rolValidators.validateFields,
    validateFields,
    rolController.removePermissions
); // http://localhost:3000/api/rol/:id/remove_permissions

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