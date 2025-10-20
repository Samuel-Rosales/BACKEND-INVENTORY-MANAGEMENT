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
exports.ProductServices = void 0;
const config_1 = require("../config");
class ProductService {
    async getAll() {
        try {
            const products = await config_1.ProductDB.findAll({
                include: [{
                        model: config_1.CategoryDB, as: "category"
                    }]
            });
            return {
                status: 200,
                message: "Products obtained correctly",
                data: products,
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
    async getOne(product_id) {
        try {
            const product = await config_1.ProductDB.findByPk(product_id, {
                include: [{
                        model: config_1.CategoryDB, as: "category"
                    }]
            });
            return {
                status: 200,
                message: "Product obtained correctly",
                data: product,
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
    async create(product) {
        try {
            const { createdAt, updatedAt } = product, productData = __rest(product, ["createdAt", "updatedAt"]);
            const newProduct = await config_1.ProductDB.create(productData);
            return {
                status: 201,
                message: "Product created successfully",
                data: newProduct,
            };
        }
        catch (error) {
            console.error("Error creating product: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(product_id, product) {
        try {
            const { createdAt, updatedAt } = product, productData = __rest(product, ["createdAt", "updatedAt"]);
            await config_1.ProductDB.update(productData, { where: { product_id } });
            const updatedProduct = await config_1.ProductDB.findByPk(product_id);
            return {
                status: 200,
                message: "Product update correctly",
                data: updatedProduct,
            };
        }
        catch (error) {
            console.error("Error updating product: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(product_id) {
        try {
            await config_1.ProductDB.destroy({ where: { product_id } });
            return {
                status: 200,
                message: "Product deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting product: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.ProductServices = new ProductService();
