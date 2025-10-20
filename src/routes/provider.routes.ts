import { Router } from "express";
import { validateFields } from "../middlewares";
import { providerValidators } from "../validators"; 
import { ProviderController } from "../controllers";

const router = Router();
const providercontroller = new ProviderController();

// METHOD GET
router.get("/",
    providercontroller.all
); // http://localhost:3000/api/provider

router.get("/:id", 
    providerValidators.validateProviderParamIdExists,
    providercontroller.one
); // http://localhost:3000/api/provider/:id

// METHOD POST
router.post("/",
    providerValidators.validateCreateFields,
    validateFields,
    providercontroller.create
); // http://localhost:3000/api/provider

//METHOD PATCH
router.patch("/:id",
    providerValidators.validateUpdateFields,
    validateFields,
    providercontroller.update,
); // http://localhost:3000/api/provider/:id

//METHOD DELETE
router.delete("/:id",
    providerValidators.validateProviderParamIdExists,
    providercontroller.delete
); // http://localhost:3000/api/provider/:id

export const ProviderRoute = router;

export default router;