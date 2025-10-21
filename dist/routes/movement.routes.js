"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const movementController = new controllers_1.MovementController();
//METHOD GET
router.get("/", movementController.all); // http://localhost:3000/api/movement
router.get("/:id", validators_1.movementValidators.validateMovementParamIdExists, movementController.one); // http://localhost:3000/api/movement/:id
router.get("/product/:product_id", movementController.all); // http://localhost:3000/api/movement/product/:product_id
//METHOD POST 
router.post("/:id", validators_1.movementValidators.validateCreateFields, validators_1.movementValidators.validateDepotIdExists, validators_1.movementValidators.validateProductIdExists, middlewares_1.validateFields, movementController.create); // http://localhost:3000/api/movement/:id
//METHOD PATCH
router.patch("/:id", validators_1.movementValidators.validateUpdateMovementFields, validators_1.movementValidators.validateMovementParamIdExists, validators_1.movementValidators.validateDepotIdExists, validators_1.movementValidators.validateProductIdExists, middlewares_1.validateFields, movementController.update); // http://localhost:3000/api/movement/:id
//METHOD DELETE
router.delete("/:id", validators_1.movementValidators.validateMovementParamIdExists, movementController.delete); // http://localhost:3000/api/movement/:id
exports.MovementRoute = router;
exports.default = router;
