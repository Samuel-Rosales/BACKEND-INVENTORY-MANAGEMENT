"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleDetailRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const saledetailController = new controllers_1.SaleDetailController();
// METHOD GET
router.get("/", saledetailController.all); // http://localhost:3000/api/sale_detail
router.get("/:id", validators_1.saleDetailValidators.validateSaleDetailParamIdExists, saledetailController.one); // http://localhost:3000/api/sale_detail/:id
// METHOD POST
router.post("/", validators_1.saleDetailValidators.validateCreateFields, validators_1.saleDetailValidators.validateProductIdExists, validators_1.saleDetailValidators.validateSaleIdExists, middlewares_1.validateFields, saledetailController.create); // http://localhost:3000/api/sale_detail
//METHOD PATCH
router.patch("/:id", validators_1.saleDetailValidators.validateUpdateFields, validators_1.saleDetailValidators.validateProductIdExists, validators_1.saleDetailValidators.validateSaleIdExists, middlewares_1.validateFields, saledetailController.update); // http://localhost:3000/api/sale_detail/:id
//METHOD DELETE
router.delete("/:id", validators_1.saleDetailValidators.validateSaleDetailParamIdExists, saledetailController.delete); // http://localhost:3000/api/sale_detail/:id
exports.SaleDetailRoute = router;
exports.default = router;
