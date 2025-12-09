import { Router } from "express";
import { validateFields } from "../middlewares";
import { CategoryController } from "../controllers";
import { categoryValidators } from "../validators";

const router = Router();
const categoryController = new CategoryController();

// METHOD GET
router.get("/",
    categoryController.all
); // http://localhost:3000/api/category

router.get("/:id",
    categoryValidators.validateCategoryParamIdExists,
    categoryController.one
); // http://localhost:3000/api/category/:id

// METHOD POST
router.post("/",
    categoryValidators.validateFields,
    validateFields,
    categoryController.create
); // http://localhost:3000/api/category

// METHOD PATCH
router.patch("/:id",
    categoryValidators.validateFields,
    categoryValidators.validateCategoryParamIdExists,
    validateFields,
    categoryController.update
); // http://localhost:3000/api/category/:id

router.patch("/:id/deactivate",
    categoryValidators.validateCategoryParamIdExists,
    categoryController.updateDeactivate
); // http://localhost:3000/api/category/:id/deactivate

router.patch("/:id/activate",
    categoryValidators.validateCategoryParamIdExists,
    categoryController.updateActivate
); // http://localhost:3000/api/category/:id/activate

// METHOD DELETE
router.delete("/:id",
    categoryValidators.validateCategoryParamIdExists,
    categoryController.delete
); // http://localhost:3000/api/category/:id

export const CategoryRoute = router;

export default router;