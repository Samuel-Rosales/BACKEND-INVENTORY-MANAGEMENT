import type { Request, Response } from "express";
import { ExchangeRateServices } from "../services";

export class ExchangeRateController {
    constructor() {}

    currentRate = async (req: Request, res: Response) => {

        const { status, message, data } = await ExchangeRateServices.getCurrentRate();

        return res.status(status).json({
            message,
            data,
        });
    };
}