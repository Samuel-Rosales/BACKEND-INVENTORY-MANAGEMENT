"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../validators");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const providercontroller = new controllers_1.ProviderController();
// METHOD GET
router.get("/", providercontroller.all); // http://localhost:3000/api/provider
router.get("/:id", validators_1.providerValidators.validateProviderParamIdExists, providercontroller.one); // http://localhost:3000/api/provider/:id
// METHOD POST
router.post("/", validators_1.providerValidators.validateCreateFields, middlewares_1.validateFields, providercontroller.create); // http://localhost:3000/api/provider
//METHOD PATCH
router.patch("/:id", validators_1.providerValidators.validateUpdateFields, middlewares_1.validateFields, providercontroller.update); // http://localhost:3000/api/provider/:id
//METHOD DELETE
router.delete("/:id", validators_1.providerValidators.validateProviderParamIdExists, providercontroller.delete); // http://localhost:3000/api/provider/:id
exports.ProviderRoute = router;
exports.default = router;
