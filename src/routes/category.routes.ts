import { Router  } from "express";
import { validateFields } from "../middlewares";
import { CategroyController } from "../controllers";
import { categoryValidators } from "../validators";

const router = Router();
const categoryController = new CategroyController();

// METHOD GET
router.get("/", 
    categoryController.all); // http://localhost:3000/api/category

router.get("/:id", 
    categoryValidators.validateCategoryIdExists, 
    categoryController.one); // http://localhost:3000/api/category/:id

// METHOD POST
router.post("/",
    categoryValidators.validateFields,
    validateFields,
    categoryController.create
); // http://localhost:3000/api/category

// METHOD DELETE
router.delete("/:id", 
    categoryValidators.validateCategoryIdExists,
    categoryController.delete
); // http://localhost:3000/api/category/:id

export const CategoryRoute = router;

export default router;