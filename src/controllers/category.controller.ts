import type { Request, Response } from "express";
import { CategoryServices } from "../services";

export class CategoryController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await CategoryServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };
    
    one = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data} = await CategoryServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data
        });
    };

    create = async (req: Request, res: Response) => {
        const { status, message, data } = await CategoryServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
     };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await CategoryServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    updateDeactivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await CategoryServices.updateDeactivate(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    updateActivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await CategoryServices.updateActivate(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

     delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await CategoryServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
     };
}