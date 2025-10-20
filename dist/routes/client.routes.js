"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../validators");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const clientController = new controllers_1.ClientController();
// METHOD GET
router.get("/", clientController.all); // http://localhost:3000/api/client
router.get("/:id", validators_1.clientValidators.validateClientParamCIExists, clientController.one); // http://localhost:3000/api/client/:id
// METHOD POST
router.post("/", validators_1.clientValidators.validateCreateFields, middlewares_1.validateFields, clientController.create); // http://localhost:3000/api/client
//METHOD PATCH
router.patch("/:id", validators_1.clientValidators.validateUpdateFields, middlewares_1.validateFields, clientController.update); // http://localhost:3000/api/client/:id
//METHOD DELETE
router.delete("/:id", validators_1.clientValidators.validateClientParamCIExists, clientController.delete); // http://localhost:3000/api/client/:id
exports.ClientRoute = router;
exports.default = router;
