import { Request, Response } from "express";
import { MovementServices } from "../services";
import { ProductDB } from "../models";
import { ProductInterface } from "@/interfaces";

export class MovementController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await MovementServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => {
        const { id } = req.params;

        const { status, message, data } = await MovementServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    create = async (req: Request, res: Response) => {
        const { status, message, data } = await MovementServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    createAjustPositive = async (req: Request, res: Response) => {

        const movementInput = req.body;

        const date_expiration = req.body.date_expiration;

        const product = await ProductDB.findByPk(movementInput.product_id);
        const productJson = product?.toJSON() as ProductInterface;

        if (productJson.perishable){
            if (!date_expiration) {
                return res.status(400).json({
                    message: "date_expiration is required for positive adjustments of perishable products",
                    data: null,
                });
            }

            const isDateValid = (date: any) => {
                return new Date(date).toString() !== 'Invalid Date';
            }

            if (!isDateValid(date_expiration)) {
                return res.status(400).json({
                    message: "date_expiration must be a valid date",
                    data: null,
                });
            }
        }
        const { status, message, data } = await MovementServices.createAjustPositive(movementInput, date_expiration);

        return res.status(status).json({
            message,
            data,
        });
    };

    createAjustNegative = async (req: Request, res: Response) => {
        const movementInput = req.body;
        const stock_lot_id = req.body.stock_lot_id;

        const product = await ProductDB.findByPk(movementInput.product_id);
        const productJson = product?.toJSON() as ProductInterface;
        
        if (productJson.perishable) {

            if (!stock_lot_id) {
                return res.status(400).json({
                    message: "stock_lot_id is required for negative adjustments of perishable products",
                    data: null,
                });
            }

            if (typeof stock_lot_id !== 'number') {
                return res.status(400).json({
                    message: "stock_lot_id must be a number",
                    data: null,
                });
            }  
        }

        const { status, message, data } = await MovementServices.createAjustNegative(movementInput, stock_lot_id);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await MovementServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await MovementServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
    };
}