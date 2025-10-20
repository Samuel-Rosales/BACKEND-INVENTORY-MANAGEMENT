"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const purchaseController = new controllers_1.PurchaseController();
// METHOD GET
router.get("/", purchaseController.all); // http://localhost:3000/api/purchase
router.get("/:id", validators_1.purchaseValidators.validatePurchaseParamIdExists, purchaseController.one); // http://localhost:3000/api/purchase/:id
// METHOD POST
router.post("/", validators_1.purchaseValidators.validateCreateFields, validators_1.purchaseValidators.validateProviderIdExists, validators_1.purchaseValidators.validateUserIdExists, validators_1.purchaseValidators.validateTypePaymentIdExists, middlewares_1.validateFields, purchaseController.create); // http://localhost:3000/api/purchase
//METHOD PATCH
router.patch("/:id", validators_1.purchaseValidators.validateUpdateFields, validators_1.purchaseValidators.validateProviderIdExists, validators_1.purchaseValidators.validateUserIdExists, validators_1.purchaseValidators.validateTypePaymentIdExists, middlewares_1.validateFields, purchaseController.update); // http://localhost:3000/api/purchase/:id
//METHOD DELETE
router.delete("/:id", validators_1.purchaseValidators.validatePurchaseParamIdExists, purchaseController.delete); // http://localhost:3000/api/type_payment/:id
exports.PurchaseRoute = router;
exports.default = router;
