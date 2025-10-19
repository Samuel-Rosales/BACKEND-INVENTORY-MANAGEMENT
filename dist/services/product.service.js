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
                include: { model: config_1.CategoryDB }
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
                include: { model: config_1.CategoryDB },
            });
            if (!product) {
                return {
                    status: 404,
                    message: "Product not found",
                    data: null,
                };
            }
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
    //mas adelante me encargo de ver como funciona las actualziaciones para saber si poner put o patch
    async delete(product_id) {
        try {
            const product = await config_1.ProductDB.findByPk(product_id);
            if (!product) {
                return {
                    status: 404,
                    message: "Product not found",
                    data: null,
                };
            }
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
