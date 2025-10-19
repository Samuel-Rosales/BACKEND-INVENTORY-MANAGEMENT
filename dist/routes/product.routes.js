"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const productController = new controllers_1.ProductController();
//  METHOD GET
router.get("/", productController.all); // http://localhost:3000/api/product
router.get("/:id", validators_1.productValidators.validateProductParamIdExists, productController.one); // http://localhost:3000/api/product/:id
router.get("/category/:category_id", productController.all); // http://localhost:3000/api/product/category/:categoryId
//METHOD POST
router.post("/", validators_1.productValidators.validateFields, validators_1.productValidators.validateCatgegoryIdExists, middlewares_1.validateFields, productController.create);
//METHOD PUT OR PATCH
//METHOD DELETE
router.delete("/:id", validators_1.productValidators.validateProductParamIdExists, productController.delete);
exports.ProductRoute = router;
exports.default = router;
