import { SaleDetailDB } from "src/config";

export const saleDetailSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta...");

        const detailsToCreate = [
            // --- Detalles para la Venta ID 1 (Cliente: Ana Pérez) ---
            { sale_id: 1, product_id: 1, unit_cost: 999.99, amount: 1, status: true }, // Laptop
            { sale_id: 1, product_id: 2, unit_cost: 219.50, amount: 1, status: true }, // Monitor
            { sale_id: 1, product_id: 8, unit_cost: 49.99, amount: 2, status: true }, // Toner (agregado)
            
            // --- Detalles para la Venta ID 2 (Cliente: Roberto Gómez) ---
            { sale_id: 2, product_id: 5, unit_cost: 179.99, amount: 2, status: true }, // Silla Ergonómica

            // --- Detalles para la Venta ID 3 (Cliente: Sofía Hernández) ---
            { sale_id: 3, product_id: 3, unit_cost: 18.25, amount: 3, status: true }, // Martillo
            { sale_id: 3, product_id: 4, unit_cost: 14.99, amount: 2, status: true }, // Destornillador (agregado)
            { sale_id: 3, product_id: 9, unit_cost: 19.50, amount: 1, status: true }, // Guantes (agregado)

            // --- NUEVOS DETALLES ---
            // --- Detalles para la Venta ID 4 (Cliente recurrente: Ana Pérez) ---
            { sale_id: 4, product_id: 7, unit_cost: 5.99, amount: 10, status: true }, // Resma de Papel

            // --- Detalles para la Venta ID 5 (Cliente: Elsa Martínez) ---
            { sale_id: 5, product_id: 6, unit_cost: 110.00, amount: 4, status: true }, // Archivador
        ];

        // --- Lógica de inserción ---
        const finalDetails = detailsToCreate.map(detail => ({
            ...detail,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const createdDetails = await SaleDetailDB.bulkCreate(finalDetails);
        console.log(`Seed de Detalles de Venta ejecutado correctamente. Insertados: ${createdDetails.length} detalles.`);

    } catch (error) {
        console.error("Error al ejecutar seed de Detalles de Venta:", error);
        throw error;
    }
};