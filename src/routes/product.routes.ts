import { Router } from "express";
import { validateFields, validateJWT, checkPermission } from "../middlewares";
import { ProductController } from "../controllers";
import { productValidators } from "../validators";
import { upload } from "../middlewares";

const router = Router();
const controller = new ProductController();

//  METHOD GET
router.get("/", 
    //validateJWT,
    //checkPermission("read:products"),
    controller.all
); // http://localhost:3000/api/product

router.get("/:id/stock_availability", 
    //validateJWT,
    //checkPermission("read:products"),
    controller.getStockDetails
); // http://localhost:3000/api/product/:id/stock_availability

router.get("/:id", 
    productValidators.validateProductParamIdExists, 
    controller.one
); // http://localhost:3000/api/product/:id

router.get("/category/:category_id", 
    controller.all
); // http://localhost:3000/api/product/category/:category_id

//METHOD POST
router.post("/",
    upload.single('image'),
    productValidators.validateCreateFields,
    productValidators.validateCatgegoryIdExists,
    validateFields,
    controller.create
); // http://localhost:3000/api/product  // aqui se puede hacer el ajuste de metodos para validar por medio de otro validator


//METHOD PATCH
router.patch("/:id",
    upload.single('image'),
    productValidators.validateUpdateFields,
    productValidators.validateProductParamIdExists,
    validateFields,
    controller.update,
); // http://localhost:3000/api/product/:id

router.patch("/:id/deactivate", 
    productValidators.validateProductParamIdExists,
    controller.updateDeactivate
); // http://localhost:3000/api/product/:id/deactivate

router.patch("/:id/activate", 
    productValidators.validateProductParamIdExists,
    controller.updateActivate
); // http://localhost:3000/api/product/:id/activate

//METHOD DELETE
router.delete("/:id", 
    productValidators.validateProductParamIdExists, 
    controller.delete
); // http://localhost:3000/api/product/:id

export  const ProductRoute = router;

export default router;