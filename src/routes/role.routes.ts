import { Router } from "express";
import { validateFields } from "../middlewares";
import { RoleController } from "../controllers";
import { rolValidators } from "../validators";

const router = Router();
const rolController = new RoleController();

//  METHOD GET
//  METHOD GET
router.get("/",
    rolController.all
); // http://localhost:3000/api/role

router.get("/:id",
    rolValidators.validateRoleParamIdExists,
    rolController.one,
); // http://localhost:3000/api/role/:id

router.get("/:id/permissions",
    rolValidators.validateRoleParamIdExists,
    rolController.getPermissionsByRoleId,
); // http://localhost:3000/api/role/:id/permissions

router.post('/check_permission',
    rolController.checkrolePermission
); // http://localhost:3000/api/role/check_permission

//METHOD POST
router.post("/",
    rolValidators.validateFields,
    validateFields,
    rolController.create
); // http://localhost:3000/api/role

//MeTHOD PUT
router.patch("/:id/assign_permissions",
    rolValidators.validateFields,
    validateFields,
    rolController.assignPermissions
); // http://localhost:3000/api/role/:id/assign_permissions

router.patch("/:id/remove_permissions",
    rolValidators.validateFields,
    validateFields,
    rolController.removePermissions
); // http://localhost:3000/api/role/:id/remove_permissions

//METHOD PATCH
router.patch("/:id",
    rolValidators.validateFields,
    rolValidators.validateRoleParamIdExists,
    validateFields,
    rolController.update,
); // http://localhost:3000/api/role/:id

//METHOD DELETE
router.delete("/:id",
    rolValidators.validateRoleParamIdExists,
    rolController.delete
); // http://localhost:3000/api/role/:id

export const RoleRoute = router;

export default router;