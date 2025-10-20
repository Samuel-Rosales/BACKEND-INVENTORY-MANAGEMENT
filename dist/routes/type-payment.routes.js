"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypePaymentRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const typePaymentController = new controllers_1.TypePaymentController();
// METHOD GET
router.get("/", typePaymentController.all); // http://localhost:3000/api/type_payment
router.get("/:id", validators_1.typePaymentValidators.validateTypePaymentParamIdExists, typePaymentController.one); // http://localhost:3000/api/type_payment/:id
// METHOD POST
router.post("/", validators_1.typePaymentValidators.validateFields, middlewares_1.validateFields, typePaymentController.create); // http://localhost:3000/api/type_payment
//METHOD PATCH
router.patch("/:id", validators_1.typePaymentValidators.validateFields, validators_1.typePaymentValidators.validateTypePaymentParamIdExists, middlewares_1.validateFields, typePaymentController.update); // http://localhost:3000/api/type_payment/:id
//METHOD DELETE
router.delete("/:id", validators_1.typePaymentValidators.validateTypePaymentParamIdExists, typePaymentController.delete); // http://localhost:3000/api/type_payment/:id
exports.TypePaymentRoute = router;
exports.default = router;
