"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
const categoryController = new controllers_1.CategroyController();
// METHOD GET
router.get("/", categoryController.all); // http://localhost:3000/api/category
router.get("/:id", validators_1.categoryValidators.validateCategoryIdExists, categoryController.one); // http://localhost:3000/api/category/:id
// METHOD POST
router.post("/", validators_1.categoryValidators.validateFields, middlewares_1.validateFields, categoryController.create); // http://localhost:3000/api/category
// METHOD DELETE
router.delete("/:id", validators_1.categoryValidators.validateCategoryIdExists, categoryController.delete); // http://localhost:3000/api/category/:id
exports.CategoryRoute = router;
exports.default = router;
