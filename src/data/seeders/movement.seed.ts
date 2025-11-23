import { MovementDB } from "src/models";

export const movementSeed = async () => {
    try {
        console.log("Iniciando seed de Movimientos...");

        const movementsToCreate = [
            // --- Entrada Inicial de Laptops ---
            {
                depot_id: 1, // Almacén Central Norte
                product_id: 1, // Laptop HP ProBook
                user_ci: "31350493",
                type: 'Ajuste Positivo', // <-- CORREGIDO (Tipo descriptivo)
                amount: 50,
                observation: "Lote inicial de laptops por apertura de inventario.",
                fecha: new Date(new Date().setDate(new Date().getDate() - 10)), // <-- CORREGIDO
                status: true,
            },
            // --- Entrada Inicial de Martillos ---
            {
                depot_id: 1, // Almacén Central Norte
                product_id: 2, // Martillo de Uña 20oz
                type: 'Ajuste Positivo', // <-- CORREGIDO (Tipo descriptivo)
                user_ci: "31366298",
                amount: 100,
                observation: "Compra mayorista de herramientas básicas.",
                fecha: new Date(new Date().setDate(new Date().getDate() - 8)), // <-- CORREGIDO
                status: true,
            },
            // --- Salida (Venta/Uso Interno) de Laptops ---
            {
                depot_id: 1,
                product_id: 1, 
                type: 'Venta', // <-- CORREGIDO (Coincide con SaleService)
                user_ci: "31350493",
                amount: 10,
                observation: "Venta a cliente corporativo #1234.",
                fecha: new Date(new Date().setDate(new Date().getDate() - 5)), // <-- CORREGIDO
                status: true,
            },
            // --- Salida (Transferencia) de Martillos ---
            {
                depot_id: 1,
                product_id: 2, 
                type: 'Compra', // <-- CORREGIDO (Más descriptivo)
                user_ci: "31366298",
                amount: 20,
                observation: "Transferencia a unidad de mantenimiento (uso interno).",
                fecha: new Date(new Date().setDate(new Date().getDate() - 2)), // <-- CORREGIDO
                status: true,
            },
        ];
        
        const finalMovements = movementsToCreate.map(movement => ({
            ...movement,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const createdMovements = await MovementDB.bulkCreate(finalMovements);
        console.log(`Seed de Movimientos ejecutado correctamente. Insertados: ${createdMovements.length}`);

    } catch (error) {
        console.error("Error al ejecutar seed de Movimientos:", error);
        throw error;
    }
};