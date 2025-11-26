// src/data/seeders/purchase.seed.ts
import { PurchaseDB } from "src/models";

export const purchaseSeed = async () => {
    try {
        console.log("Iniciando seed de Compras (Cabecera)...");

        const purchasesToCreate = [
            // --- Compra 1 (Oct 14) ---
            // Items General: Mesa (5*190) + Estante (10*45) = 1400
            // Items Lote: Harina (100*1.10) + Margarina (40*2.50) = 210
            // TOTAL REAL: 1610.00
            {
                provider_id: 1, // Tecno Suministros C.A.
                user_ci: "31350493", // Samuel Rosales (Admin)
                type_payment_id: 2, // Transferencia Bancaria
                bought_at: new Date("2025-10-14T10:00:00"),
                status: 'Aprobado',
                active: true,
                total_usd: 1610.00, // <-- CORREGIDO (Suma real de items)
                exchange_rate: 36.45, 
                total_ves: 1610.00 * 36.45, 
            },
            
            // --- Compra 2 (Oct 18) ---
            // Items General: Martillo (20*42) + Tirro (50*2.20) = 950
            // Items Lote: Harina (50*1.15) = 57.50
            // TOTAL REAL: 1007.50
            {
                provider_id: 2, // Distribuidora Universal
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 1, // Efectivo
                bought_at: new Date("2025-10-18T15:30:00"),
                status: 'Pendiente',
                active: true,
                total_usd: 1007.50, // <-- CORREGIDO
                exchange_rate: 36.52, 
                total_ves: 1007.50 * 36.52, 
            },

            // --- Compra 3 (Oct 16) ---
            // Items General: Silla (8*20) + Teipe (30*4) = 280
            // Items Lote: Crema Dental (60*2.80) + Desodorante (35*4.50) = 325.50
            // TOTAL REAL: 605.50
            {
                provider_id: 3, // Servicios Generales LTDA
                user_ci: "31366298", // Edgar Briceño (Operador)
                type_payment_id: 3, // Tarjeta de Débito
                bought_at: new Date("2025-10-16T11:00:00"),
                status: 'Aprobado',
                active: true,
                total_usd: 605.50, // <-- CORREGIDO
                exchange_rate: 36.50,
                total_ves: 605.50 * 36.50,
            },

            // --- Compra 4 (Oct 19) ---
            // Items General: Destornillador (40*9.50) + Pintura (15*5) = 455
            // Items Lote: Pasta (80*1.90) = 152
            // TOTAL REAL: 607.00
            {
                provider_id: 4, // Materiales e Insumos Rápidos
                user_ci: "29778174", // Jesús Ramos (Gerente)
                type_payment_id: 4, // Tarjeta de Crédito
                bought_at: new Date("2025-10-19T09:45:00"),
                status: 'Aprobado',
                active: true,
                total_usd: 607.00, // <-- CORREGIDO
                exchange_rate: 36.55,
                total_ves: 607.00 * 36.55,
            },
            
            // NOTA: Eliminé la compra del 21 de Octubre porque NO creamos items para ella 
            // en los archivos anteriores. Si la dejamos, quedaría como una compra "vacía" (sin detalles).
        ];

        // --- Validación de duplicados ---
        // Buscamos compras existentes por fecha y proveedor para no repetir
        const existingPurchases = await PurchaseDB.findAll({ attributes: ['provider_id', 'bought_at'] });
        const existingSet = new Set(existingPurchases.map(p => 
            `${(p as any).provider_id}-${(p as any).bought_at.toISOString()}`
        ));

        const finalPurchases = [];
        for (const purchase of purchasesToCreate) {
            const key = `${purchase.provider_id}-${purchase.bought_at.toISOString()}`;
            
            if (existingSet.has(key)) {
                console.log(`Compra del ${purchase.bought_at} (Proveedor ${purchase.provider_id}) ya existe. Saltando...`);
                continue;
            }

            finalPurchases.push({
                ...purchase,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        if (finalPurchases.length > 0) {
            const createdPurchases = await PurchaseDB.bulkCreate(finalPurchases);
            console.log(`Seed de Compras ejecutado correctamente. Insertadas: ${createdPurchases.length} compras.`);
        } else {
            console.log("Seed de Compras ejecutado. No se insertaron registros nuevos.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Compras:", error);
        throw error;
    }
};