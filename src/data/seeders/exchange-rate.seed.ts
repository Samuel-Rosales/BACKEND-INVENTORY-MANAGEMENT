import { ExchangeRateDB } from "src/models";

export const exchangeRateSeed = async () => {
    try {
        console.log("Iniciando seed de Tasas de cambio...");

        const exchangeRateToCreate = [
            {
                rate: "231.0938",
                date: "2025-11-11",
            },
            // Puedes añadir más aquí
            // { rate: "232.0000", date: "2025-11-12" },
        ];

        // 1. Intenta insertar todo.
        // La base de datos (gracias a la restricción UNIQUE)
        // se encargará de rechazar las que ya existen.
        const createdExchangeRate = await ExchangeRateDB.bulkCreate(exchangeRateToCreate, {
            ignoreDuplicates: true // <-- ¡Esta es la magia!
        });

        // 'createdExchangeRate' contendrá solo las filas que SÍ se insertaron.
        if (createdExchangeRate.length > 0) {
            console.log(`Seed de Tasa de cambio ejecutado. Insertadas: ${createdExchangeRate.length}`);
        } else {
            console.log("Seed de Tasa de cambio ejecutado. No se insertaron nuevas tasas (todas ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Tasas de cambio:", error);
        throw error;
    }
};