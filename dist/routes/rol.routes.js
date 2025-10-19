"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const rolController = new controllers_1.RolController();
//  METHOD GET
router.get("/", rolController.all); // http://localhost:3000/api/rol
router.get("/:id", validators_1.rolValidators.validateRolParamIdExists, rolController.one); // http://localhost:3000/api/rol/:id
router.get("/user/:user_id", rolController.all); // http://localhost:3000/api/rol/user/:user_id
//METHOD POST
router.post("/", validators_1.rolValidators.validateFields, middlewares_1.validateFields, rolController.create); // http://localhost:3000/api/rol
//METHOD PATCH
router.patch("/:id", validators_1.rolValidators.validateFields, validators_1.rolValidators.validateRolParamIdExists, middlewares_1.validateFields, rolController.update); // http://localhost:3000/api/rol/:id
//METHOD DELETE
router.delete("/:id", validators_1.rolValidators.validateRolParamIdExists, rolController.delete); // http://localhost:3000/api/rol/:id
exports.RolRoute = router;
exports.default = router;
