import { Router } from "express";
import { validateFields } from "../middlewares";
import { ProductController } from "../controllers";
import { productValidators } from "../validators";
import { upload } from "../middlewares";
import { validateJWT } from "../middlewares/validateJWT";
import { checkPermission } from "../middlewares/checkPermission";

const router = Router();
const productController = new ProductController();

//  METHOD GET
router.get("/", 
    validateJWT,
    checkPermission("read:products"),
    productController.all
); // http://localhost:3000/api/product

router.get("/:id", 
    productValidators.validateProductParamIdExists, 
    productController.one
); // http://localhost:3000/api/product/:id

router.get("/category/:category_id", 
    productController.all
); // http://localhost:3000/api/product/category/:category_id

//METHOD POST
router.post("/",
    upload.single('image'),
    productValidators.validateCreateFields,
    productValidators.validateCatgegoryIdExists,
    validateFields,
    productController.create
); // http://localhost:3000/api/product  // aqui se puede hacer el ajuste de metodos para validar por medio de otro validator


//METHOD PATCH
router.patch("/:id",
    upload.single('image'),
    productValidators.validateUpdateFields,
    productValidators.validateProductParamIdExists,
    validateFields,
    productController.update,
); // http://localhost:3000/api/product/:id

//METHOD DELETE
router.delete("/:id", 
    productValidators.validateProductParamIdExists, 
    productController.delete
); // http://localhost:3000/api/product/:id

export  const ProductRoute = router;

export default router;