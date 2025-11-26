// src/data/seeders/sale.seed.ts
import { SaleDB } from "src/models";

export const saleSeed = async () => {
    try {
        console.log("Iniciando seed de Ventas (Cabecera)...");

        const salesToCreate = [
            // --- Venta 1 (Oct 18) ---
            // Items: Mesa (1*210) + Sillas (4*23 = 92)
            // TOTAL REAL: 302.00
            {
                client_ci: "12345678", // Cliente: Ana María Pérez
                user_ci: "31366298", // Vendedor: Edgar Briceño
                type_payment_id: 3, // Tarjeta de Débito
                sold_at: new Date("2025-10-18T14:30:00"),
                status: true,
                total_usd: 302.00, // <-- CORREGIDO
                exchange_rate: 36.52, 
                total_ves: 302.00 * 36.52, 
            },

            // --- Venta 2 (Oct 20) ---
            // Items: Sillas (2*23)
            // TOTAL REAL: 46.00
            {
                client_ci: "20987654", // Cliente: Roberto Gómez Bolaños
                user_ci: "29778174", // Vendedor: Jesús Ramos
                type_payment_id: 5, // Pago Móvil
                sold_at: new Date("2025-10-20T11:00:00"),
                status: true,
                total_usd: 46.00, // <-- CORREGIDO
                exchange_rate: 36.58, 
                total_ves: 46.00 * 36.58, 
            },

            // --- Venta 3 (Oct 21 AM) ---
            // Items: Martillo (1*48) + Destornillador (1*11) + Teipe (3*5.50=16.5)
            // TOTAL REAL: 75.50
            {
                client_ci: "08765432", // Cliente: Sofía Hernández García
                user_ci: "31366298", // Vendedor: Edgar Briceño
                type_payment_id: 1, // Efectivo
                sold_at: new Date("2025-10-21T09:15:00"),
                status: true,
                total_usd: 75.50, // <-- CORREGIDO
                exchange_rate: 36.60, 
                total_ves: 75.50 * 36.60, 
            },

            // --- Venta 4 (Oct 21 PM) ---
            // Items: Tirro de Embalaje (5*3.50)
            // TOTAL REAL: 17.50
            {
                client_ci: "12345678", // Cliente: Ana María Pérez (compra recurrente)
                user_ci: "31350493", // Vendedor: Samuel Rosales
                type_payment_id: 4, // Tarjeta de Crédito
                sold_at: new Date("2025-10-21T16:00:00"), // Hoy en la tarde
                status: true,
                total_usd: 17.50, // <-- CORREGIDO
                exchange_rate: 36.60, 
                total_ves: 17.50 * 36.60, 
            },

            // --- Venta 5 (Oct 15) ---
            // Items: Estante Plástico (2*55)
            // TOTAL REAL: 110.00
            {
                client_ci: "25135790", // Cliente: Elsa Martínez
                user_ci: "29778174", // Vendedor: Jesús Ramos
                type_payment_id: 2, // Transferencia Bancaria
                sold_at: new Date("2025-10-15T10:00:00"), // La semana pasada
                status: true,
                total_usd: 110.00, // <-- CORREGIDO
                exchange_rate: 36.48, 
                total_ves: 110.00 * 36.48, 
            },
        ];

        // --- Lógica de inserción ---
        // Verificar duplicados por fecha exacta y cliente
        const existingSales = await SaleDB.findAll({ attributes: ['client_ci', 'sold_at'] });
        const existingSet = new Set(existingSales.map(s => 
            `${(s as any).client_ci}-${(s as any).sold_at.toISOString()}`
        ));

        const finalSales = [];
        for (const sale of salesToCreate) {
            const key = `${sale.client_ci}-${sale.sold_at.toISOString()}`;
            
            if (existingSet.has(key)) {
                console.log(`Venta a ${sale.client_ci} del ${sale.sold_at} ya existe. Saltando...`);
                continue;
            }

            finalSales.push({
                ...sale,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        if (finalSales.length > 0) {
            const createdSales = await SaleDB.bulkCreate(finalSales);
            console.log(`Seed de Ventas ejecutado correctamente. Insertadas: ${createdSales.length} ventas.`);
        } else {
            console.log("Seed de Ventas ejecutado. No se insertaron registros nuevos.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Ventas:", error);
        throw error;
    }
};