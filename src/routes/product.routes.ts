import { Router } from "express";
import { validateFields } from "../middlewares";
import { ProductController } from "../controllers";
import { productValidators } from "../validators";

const router = Router();
const productController = new ProductController();

//  METHOD GET
router.get("/", productController.all); // http://localhost:3000/api/product
router.get("/:id", productValidators.validateProductIdExists, productController.one); // http://localhost:3000/api/product/:id
router.get("/category/:categoryId", productController.all); // http://localhost:3000/api/product/category/:categoryId

//METHOD POST
router.post("/",
    productValidators.validateFields,
    productValidators.validateCatgegoryIdExists,
    validateFields,
    productController.create
);

//METHOD PUT OR PATCH
    //LUEGO VEO COMO HACER QUE FUNCIONE DE LA MANERA MAS EFICIENTE POSIBLE


//METHOD DELETE
router.delete("/:id", productValidators.validateProductIdExists, productController.delete);

export  const ProductRoute = router;

export default router;