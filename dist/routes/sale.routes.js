"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const saleController = new controllers_1.SaleController();
// METHOD GET
router.get("/", saleController.all); // http://localhost:3000/api/sale
router.get("/:id", validators_1.saleValidators.validateSaleParamIdExists, saleController.one); // http://localhost:3000/api/sale/:id
// METHOD POST
router.post("/", validators_1.saleValidators.validateCreateFields, validators_1.saleValidators.validateClientCIExists, validators_1.saleValidators.validateUserCIExists, validators_1.saleValidators.validateTypePaymentIdExists, middlewares_1.validateFields, saleController.create); // http://localhost:3000/api/sale
//METHOD PATCH
router.patch("/:id", validators_1.saleValidators.validateUpdateFields, validators_1.saleValidators.validateClientCIExists, validators_1.saleValidators.validateUserCIExists, validators_1.saleValidators.validateTypePaymentIdExists, middlewares_1.validateFields, saleController.update); // http://localhost:3000/api/sale/:id
//METHOD DELETE
router.delete("/:id", validators_1.saleValidators.validateSaleParamIdExists, saleController.delete); // http://localhost:3000/api/type_payment/:id
exports.SaleRoute = router;
exports.default = router;
