import type { Request, Response } from "express";
import { ProductServices } from "../services";
import cloudinary from '../config/cloudinary.config';

export class ProductController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await ProductServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await ProductServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {

        try {
            let imageUrl = ''; // Variable para guardar la URL de la imagen

            // 2. Si se envió un archivo, súbelo a Cloudinary
            if (req.file) {
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: "products"
                });
                imageUrl = result.secure_url;
            }

            // 3. Combina los datos del body con la nueva URL de la imagen
            const productData = {
                ...req.body,
                image_url: imageUrl // Añade la URL al objeto del producto
            };

            // 4. Llama al servicio con los datos completos
            const { status, message, data } = await ProductServices.create(productData);
            
            return res.status(status).json({
                message, 
                data 
            });

        } catch (error) {
            console.error("Error in ProductController create:", error);
            return res.status(500).json({ message: "Error uploading file or creating product" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            let imageUrl: string | undefined = undefined;

            if (req.file) {
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

                const result = await cloudinary.uploader.upload(dataURI, { folder: "products" });

                imageUrl = result.secure_url;
            }

            const productData = { ...req.body };
            if (imageUrl) {
                productData.image_url = imageUrl; // Solo añade la nueva URL si se subió una nueva imagen
            }
            
            const { status, message, data } = await ProductServices.update(Number(id), productData);

            return res.status(status).json({
                message, 
                data 
            });
        } catch (error) {
            console.error("Error in ProductController update:", error);
            
            return res.status(500).json({ 
                message: "Error uploading file or updating product" 
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await ProductServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}