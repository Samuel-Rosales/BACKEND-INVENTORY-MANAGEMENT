"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleSeed = void 0;
const models_1 = require("src/models");
const saleSeed = async () => {
    try {
        console.log("Iniciando seed de Ventas (Cabecera)...");
        const salesToCreate = [
            // --- Ventas Originales ---
            {
                client_ci: "12345678", // Cliente: Ana María Pérez
                user_ci: "31366298", // Vendedor: Edgar Briceño
                type_payment_id: 3, // Tarjeta de Débito
                sold_at: new Date("2025-10-18T14:30:00"),
                status: true,
            },
            {
                client_ci: "20987654", // Cliente: Roberto Gómez Bolaños
                user_ci: "29778174", // Vendedor: Jesús Ramos
                type_payment_id: 5, // Pago Móvil
                sold_at: new Date("2025-10-20T11:00:00"),
                status: true,
            },
            {
                client_ci: "08765432", // Cliente: Sofía Hernández García
                user_ci: "31366298", // Vendedor: Edgar Briceño
                type_payment_id: 1, // Efectivo
                sold_at: new Date("2025-10-21T09:15:00"),
                status: true,
            },
            // --- NUEVAS VENTAS ---
            {
                client_ci: "12345678", // Cliente: Ana María Pérez (compra recurrente)
                user_ci: "31350493", // Vendedor: Samuel Rosales
                type_payment_id: 4, // Tarjeta de Crédito
                sold_at: new Date("2025-10-21T16:00:00"), // Hoy en la tarde
                status: true,
            },
            {
                client_ci: "25135790", // Cliente: Elsa Martínez
                user_ci: "29778174", // Vendedor: Jesús Ramos
                type_payment_id: 2, // Transferencia Bancaria
                sold_at: new Date("2025-10-15T10:00:00"), // La semana pasada
                status: true,
            },
        ];
        // --- Lógica de inserción ---
        const finalSales = salesToCreate.map(sale => (Object.assign(Object.assign({}, sale), { createdAt: new Date(), updatedAt: new Date() })));
        const createdSales = await models_1.SaleDB.bulkCreate(finalSales);
        console.log(`Seed de Ventas ejecutado correctamente. Insertadas: ${createdSales.length} ventas.`);
    }
    catch (error) {
        console.error("Error al ejecutar seed de Ventas:", error);
        throw error;
    }
};
exports.saleSeed = saleSeed;
