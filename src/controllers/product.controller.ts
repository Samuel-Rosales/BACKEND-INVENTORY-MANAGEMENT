import type { Request, Response } from "express";
import { ProductServices } from "../services";

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
    }  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await ProductServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await ProductServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    }

}