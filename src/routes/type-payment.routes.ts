import { Router } from "express";
import { validateFields } from "../middlewares";
import { TypePaymentController } from "../controllers";
import { typePaymentValidators } from "../validators";

const router = Router();
const typePaymentController = new TypePaymentController();

// METHOD GET
router.get("/", 
    typePaymentController.all
); // http://localhost:3000/api/type_payment

router.get("/:id",
    typePaymentValidators.validateTypePaymentParamIdExists,
    typePaymentController.one,
); // http://localhost:3000/api/type_payment/:id

// METHOD POST
router.post("/",
    typePaymentValidators.validateFields,
    validateFields,
    typePaymentController.create
); // http://localhost:3000/api/type_payment

//METHOD PATCH
router.patch("/:id",
    typePaymentValidators.validateFields,
    typePaymentValidators.validateTypePaymentParamIdExists,
    validateFields,
    typePaymentController.update,
); // http://localhost:3000/api/type_payment/:id

router.patch("/:id/deactivate", 
    typePaymentValidators.validateTypePaymentParamIdExists,
    typePaymentController.updateDeactivate
); // http://localhost:3000/api/type_payment/:id/deactivate

router.patch("/:id/activate", 
    typePaymentValidators.validateTypePaymentParamIdExists,
    typePaymentController.updateActivate
); // http://localhost:3000/api/type_payment/:id/activate

//METHOD DELETE
router.delete("/:id", 
    typePaymentValidators.validateTypePaymentParamIdExists, 
    typePaymentController.delete
); // http://localhost:3000/api/type_payment/:id

export  const TypePaymentRoute = router;

export default router;