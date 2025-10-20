import { Router } from "express";
import { validateFields } from "../middlewares";
import { clientValidators } from "../validators"; 
import { ClientController } from "../controllers";

const router = Router();
const clientController = new ClientController();

// METHOD GET
router.get("/",
    clientController.all
); // http://localhost:3000/api/client

router.get("/:id", 
    clientValidators.validateClientParamCIExists,
    clientController.one
); // http://localhost:3000/api/client/:id

// METHOD POST
router.post("/",
    clientValidators.validateCreateFields,
    validateFields,
    clientController.create
); // http://localhost:3000/api/client

//METHOD PATCH
router.patch("/:id",
    clientValidators.validateUpdateFields,
    validateFields,
    clientController.update,
); // http://localhost:3000/api/client/:id

//METHOD DELETE
router.delete("/:id",
    clientValidators.validateClientParamCIExists,
    clientController.delete
); // http://localhost:3000/api/client/:id

export const ClientRoute = router;

export default router;