"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const depotController = new controllers_1.DepotController();
// METHOD GET
router.get("/", depotController.all); // http://localhost:3000/api/depot
router.get("/:id", validators_1.depotValidators.validateDepotParamIdExists, depotController.one); // http://localhost:3000/api/depot/:id
// METHOD POST
router.post("/", validators_1.depotValidators.validateFields, middlewares_1.validateFields, depotController.create); // http://localhost:3000/api/depot
//METHOD PATCH
router.patch("/:id", validators_1.depotValidators.validateFields, validators_1.depotValidators.validateDepotParamIdExists, middlewares_1.validateFields, depotController.update); // http://localhost:3000/api/depot/:id
//METHOD DELETE
router.delete("/:id", validators_1.depotValidators.validateDepotParamIdExists, depotController.delete); // http://localhost:3000/api/depot/:id
exports.DepotRoute = router;
exports.default = router;
