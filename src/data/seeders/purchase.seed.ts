import { PurchaseDB } from "src/models";

export const purchaseSeed = async () => {
    try {
        console.log("Iniciando seed de Compras (Cabecera)...");

        const purchasesToCreate = [
            // --- Compras Originales ---
            {
                provider_id: 1, // Tecno Suministros C.A.
                user_ci: "31350493", // Samuel Rosales (Admin)
                type_payment_id: 2, // Transferencia Bancaria
                bought_at: new Date("2025-10-14T10:00:00"),
                status: 'Aprobado',
                active: true,
                // --- NUEVOS CAMPOS ---
                total_usd: 150.00,
                exchange_rate: 36.45, // Tasa simulada para esa fecha
                total_ves: 150.00 * 36.45, // 5467.50
            },
            {
                provider_id: 2, // Distribuidora Universal
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 1, // Efectivo
                bought_at: new Date("2025-10-18T15:30:00"),
                status: 'Pendiente',
                active: true,
                // --- NUEVOS CAMPOS ---
                total_usd: 80.50,
                exchange_rate: 36.52, // Tasa simulada para esa fecha
                total_ves: 80.50 * 36.52, // 2939.86
            },
            // --- NUEVAS COMPRAS ---
            {
                provider_id: 3, // Servicios Generales LTDA
                user_ci: "31366298", // Edgar Briceño (Operador)
                type_payment_id: 3, // Tarjeta de Débito
                bought_at: new Date("2025-10-16T11:00:00"),
                status: 'Aprobado',
                active: true,
                // --- NUEVOS CAMPOS ---
                total_usd: 120.00,
                exchange_rate: 36.50, // Tasa simulada para esa fecha
                total_ves: 120.00 * 36.50, // 4380.00
            },
            {
                provider_id: 4, // Materiales e Insumos Rápidos
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 4, // Tarjeta de Crédito
                bought_at: new Date("2025-10-19T09:45:00"),
                status: 'Aprobado',
                active: true,
                // --- NUEVOS CAMPOS ---
                total_usd: 210.20,
                exchange_rate: 36.55, // Tasa simulada para esa fecha
                total_ves: 210.20 * 36.55, // 7682.81
            },
            {
                provider_id: 1, // Tecno Suministros C.A. (Compra recurrente)
                user_ci: "31350493", // Samuel Rosales (Admin)
                type_payment_id: 2, // Transferencia Bancaria
                bought_at: new Date("2025-10-21T08:00:00"),
                status: 'Pendiente',
                active: true,
                // --- NUEVOS CAMPOS ---
                total_usd: 300.00,
                exchange_rate: 36.60, // Tasa simulada para esa fecha
                total_ves: 300.00 * 36.60, // 10980.00
            },
        ];

        // --- Lógica de inserción (Sin cambios) ---
        const finalPurchases = purchasesToCreate.map(purchase => ({
            ...purchase,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const createdPurchases = await PurchaseDB.bulkCreate(finalPurchases);
        console.log(`Seed de Compras ejecutado correctamente. Insertadas: ${createdPurchases.length} compras.`);

    } catch (error) {
        console.error("Error al ejecutar seed de Compras:", error);
        throw error;
    }
};