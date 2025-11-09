import type { Request, Response } from "express";
import { PurchaseServices } from "../services";

export class PurchaseController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await PurchaseServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await PurchaseServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        // 1. Validar que el usuario autenticado existe
        if (!req.user || !req.user.user_ci) {
            return res.status(401).json({ 
                message: "No autorizado (Token inválido o no proveído)",
                data: null 
            });
        }

        // 2. Obtener el CI seguro del token (NO DEL BODY)
        const user_ci = req.user.user_ci;

        // 3. El 'saleInput' es el cuerpo (body) de la solicitud
        const purchaseInput = req.body;

        // 4. Inyectar el user_ci seguro en el objeto de la venta y llamar al servicio con un solo argumento
        purchaseInput.user_ci = user_ci;

        const { status, message, data } = await PurchaseServices.create(
            purchaseInput // Argumento único: Los datos de la venta ya contienen user_ci seguro
        );

        // 5. Devolver la respuesta del servicio
        return res.status(status).json({ 
            message, 
            data 
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await PurchaseServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await PurchaseServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}