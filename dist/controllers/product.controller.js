"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const services_1 = require("../services");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
class ProductController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.ProductServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.ProductServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            try {
                let imageUrl = ''; // Variable para guardar la URL de la imagen
                // 2. Si se envió un archivo, súbelo a Cloudinary
                if (req.file) {
                    const b64 = Buffer.from(req.file.buffer).toString("base64");
                    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                    const result = await cloudinary_config_1.default.uploader.upload(dataURI, {
                        folder: "products"
                    });
                    imageUrl = result.secure_url;
                }
                // 3. Combina los datos del body con la nueva URL de la imagen
                const productData = Object.assign(Object.assign({}, req.body), { image_url: imageUrl // Añade la URL al objeto del producto
                 });
                // 4. Llama al servicio con los datos completos
                const { status, message, data } = await services_1.ProductServices.create(productData);
                return res.status(status).json({
                    message,
                    data
                });
            }
            catch (error) {
                console.error("Error in ProductController create:", error);
                return res.status(500).json({ message: "Error uploading file or creating product" });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                let imageUrl = undefined;
                if (req.file) {
                    const b64 = Buffer.from(req.file.buffer).toString("base64");
                    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                    const result = await cloudinary_config_1.default.uploader.upload(dataURI, { folder: "products" });
                    imageUrl = result.secure_url;
                }
                const productData = Object.assign({}, req.body);
                if (imageUrl) {
                    productData.image_url = imageUrl; // Solo añade la nueva URL si se subió una nueva imagen
                }
                const { status, message, data } = await services_1.ProductServices.update(Number(id), productData);
                return res.status(status).json({
                    message,
                    data
                });
            }
            catch (error) {
                console.error("Error in ProductController update:", error);
                return res.status(500).json({
                    message: "Error uploading file or updating product"
                });
            }
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.ProductServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.ProductController = ProductController;
