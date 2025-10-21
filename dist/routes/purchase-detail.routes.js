"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDetailRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const purchasedetailController = new controllers_1.PurchaseDetailController();
// METHOD GET
router.get("/", purchasedetailController.all); // http://localhost:3000/api/purchase_detail
router.get("/:id", validators_1.purchaseDetailValidators.validatePurchaseDetailParamIdExists, purchasedetailController.one); // http://localhost:3000/api/purchase_detail/:id
// METHOD POST
router.post("/", validators_1.purchaseDetailValidators.validateCreateFields, validators_1.purchaseDetailValidators.validateProductIdExists, validators_1.purchaseDetailValidators.validatePurchaseIdExists, middlewares_1.validateFields, purchasedetailController.create); // http://localhost:3000/api/purchase_detail
//METHOD PATCH
router.patch("/:id", validators_1.purchaseDetailValidators.validateUpdateFields, validators_1.purchaseDetailValidators.validateProductIdExists, validators_1.purchaseDetailValidators.validatePurchaseIdExists, middlewares_1.validateFields, purchasedetailController.update); // http://localhost:3000/api/purchase_detail/:id
//METHOD DELETE
router.delete("/:id", validators_1.purchaseDetailValidators.validatePurchaseDetailParamIdExists, purchasedetailController.delete); // http://localhost:3000/api/purchase_detail/:id
exports.PurchaseDetailRoute = router;
exports.default = router;
