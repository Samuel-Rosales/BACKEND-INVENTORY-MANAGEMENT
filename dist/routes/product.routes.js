"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const middlewares_2 = require("../middlewares");
const router = (0, express_1.Router)();
const productController = new controllers_1.ProductController();
//  METHOD GET
router.get("/", productController.all); // http://localhost:3000/api/product
router.get("/:id", validators_1.productValidators.validateProductParamIdExists, productController.one); // http://localhost:3000/api/product/:id
router.get("/category/:category_id", productController.all); // http://localhost:3000/api/product/category/:category_id
//METHOD POST
router.post("/", middlewares_2.upload.single('image'), validators_1.productValidators.validateCreateFields, validators_1.productValidators.validateCatgegoryIdExists, middlewares_1.validateFields, productController.create); // http://localhost:3000/api/product  // aqui se puede hacer el ajuste de metodos para validar por medio de otro validator
//METHOD PATCH
router.patch("/:id", middlewares_2.upload.single('image'), validators_1.productValidators.validateUpdateFields, validators_1.productValidators.validateProductParamIdExists, middlewares_1.validateFields, productController.update); // http://localhost:3000/api/product/:id
//METHOD DELETE
router.delete("/:id", validators_1.productValidators.validateProductParamIdExists, productController.delete); // http://localhost:3000/api/product/:id
exports.ProductRoute = router;
exports.default = router;
