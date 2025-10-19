"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const config_1 = require("../config");
class CategoryService {
    async getAll() {
        try {
            const categories = await config_1.CategoryDB.findAll();
            return {
                status: 200,
                message: "Categories obtained correctly",
                data: categories,
            };
        }
        catch (error) {
            console.error("Error fetching products: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(category_id) {
        try {
            const category = await config_1.CategoryDB.findByPk(category_id);
            if (!category) {
                return {
                    status: 404,
                    message: "Category not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Category obtained correctly",
                data: category,
            };
        }
        catch (error) {
            console.error("Error fetching product: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(category) {
        try {
            const { createdAt, updatedAt, category_id } = category, categoryData = __rest(category, ["createdAt", "updatedAt", "category_id"]);
            const newCategory = await config_1.CategoryDB.create(categoryData);
            return {
                status: 201,
                message: "Category created correctly",
                data: newCategory,
            };
        }
        catch (error) {
            console.error("Error creating category: ", error);
            return {
                status: 500,
                message: "Internal sever error",
                data: null,
            };
        }
    }
    async update(movement_id, movement) {
        try {
            const { createdAt, updatedAt } = movement, movementData = __rest(movement, ["createdAt", "updatedAt"]);
            await config_1.CategoryDB.update(movementData, { where: { movement_id } });
            const updatedMovement = await config_1.CategoryDB.findByPk(movement_id);
            return {
                status: 200,
                message: "Category update correctly",
                data: updatedMovement,
            };
        }
        catch (error) {
            console.error("Error updating category: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(category_id) {
        try {
            const category = await config_1.CategoryDB.destroy({ where: { category_id } });
            return {
                status: 200,
                message: "Product deleted successfully"
            };
        }
        catch (error) {
            console.error("Error deleting category: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.CategoryServices = new CategoryService();
