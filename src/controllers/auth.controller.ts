import type { Request, Response } from "express";
import { AuthServices } from "../services";

export class AuthController {
    constructor() {}

    login = async (req: Request, res: Response) => {
        // Pasamos el body (que debe tener 'user_ci' y 'password') al servicio
        const { status, message, data } = await AuthServices.login(req.body);

        // El servicio ya nos da todo listo para responder
        return res.status(status).json({
            message,
            data,
        });
    };
    
    // Aquí podrías añadir 'register', 'forgotPassword', etc.
}