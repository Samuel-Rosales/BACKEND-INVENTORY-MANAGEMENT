"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseSeed = void 0;
const config_1 = require("src/config");
const purchaseSeed = async () => {
    try {
        console.log("Iniciando seed de Compras (Cabecera)...");
        const purchasesToCreate = [
            // --- Compras Originales ---
            {
                provider_id: 1, // Tecno Suministros C.A.
                user_ci: "31350493", // Samuel Rosales (Admin)
                type_payment_id: 2, // Transferencia Bancaria
                bought_at: new Date("2025-10-14T10:00:00"), // Hace 7 días
                status: 'Aprobado',
                active: true,
            },
            {
                provider_id: 2, // Distribuidora Universal
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 1, // Efectivo
                bought_at: new Date("2025-10-18T15:30:00"), // Hace 3 días
                status: 'Pendiente',
                active: true,
            },
            // --- NUEVAS COMPRAS ---
            {
                provider_id: 3, // Servicios Generales LTDA
                user_ci: "31366298", // Edgar Briceño (Operador)
                type_payment_id: 3, // Tarjeta de Débito
                bought_at: new Date("2025-10-16T11:00:00"), // Hace 5 días
                status: 'Aprobado',
                active: true,
            },
            {
                provider_id: 4, // Materiales e Insumos Rápidos
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 4, // Tarjeta de Crédito
                bought_at: new Date("2025-10-19T09:45:00"), // Hace 2 días
                status: 'Aprobado',
                active: true,
            },
            {
                provider_id: 1, // Tecno Suministros C.A. (Compra recurrente)
                user_ci: "31350493", // Samuel Rosales (Admin)
                type_payment_id: 2, // Transferencia Bancaria
                bought_at: new Date("2025-10-21T08:00:00"), // Hoy
                status: 'Pendiente',
                active: true,
            },
        ];
        // --- Lógica de inserción ---
        const finalPurchases = purchasesToCreate.map(purchase => (Object.assign(Object.assign({}, purchase), { createdAt: new Date(), updatedAt: new Date() })));
        const createdPurchases = await config_1.PurchaseDB.bulkCreate(finalPurchases);
        console.log(`Seed de Compras ejecutado correctamente. Insertadas: ${createdPurchases.length} compras.`);
    }
    catch (error) {
        console.error("Error al ejecutar seed de Compras:", error);
        throw error;
    }
};
exports.purchaseSeed = purchaseSeed;
