"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const userController = new controllers_1.UserController();
//  METHOD GET
router.get("/", userController.all); // http://localhost:3000/api/user
router.get("/:id", validators_1.userValidators.validateUserParamIdExists, userController.one); // http://localhost:3000/api/user/:id
router.get("/rol/:rol_id", userController.all); // http://localhost:3000/api/user/rol/:rol_id
//METHOD POST
router.post("/", validators_1.userValidators.validateCreateFields, validators_1.userValidators.validateUserParamIdExists, middlewares_1.validateFields, userController.create); // http://localhost:3000/api/user
//METHOD PATCH
router.patch("/:id", validators_1.userValidators.validateUpdateFields, validators_1.userValidators.validateUserParamIdExists, middlewares_1.validateFields, userController.update); // http://localhost:3000/api/product/:id
//METHOD DELETE
router.delete("/:id", validators_1.userValidators.validateUserParamIdExists, userController.delete); // http://localhost:3000/api/product/:id
exports.UserRoute = router;
exports.default = router;
