import { ExchangeRateDB } from '../models'; // Correcto

class ExchangeRateService {

    async getCurrentRate () {
        try {
            const rate = await ExchangeRateDB.findOne({
                order: [['fecha', 'DESC']] 
            });
            
            if (!rate) {
                return {
                    status: 404,
                    message: "Tasa de cambio no disponible.",
                    data: null
                };
            }
            
            return {
                status: 200,
                message: "Tasa de cambio obtenida correctamente",
                data: rate,
            };

        } catch (error) {
            console.error("Error obteniendo la tasa: ", error); 

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    };
}

export const ExchangeRateServices = new ExchangeRateService();