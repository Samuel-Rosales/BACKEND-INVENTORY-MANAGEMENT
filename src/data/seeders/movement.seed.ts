import { MovementDB } from "src/models";

export const movementSeed = async () => {
    try {
        console.log("Iniciando seed de Movimientos...");

        const movementsToCreate = [
            // --- Entrada Inicial de Laptops ---
            {
                depot_id: 1, // Almacén Central Norte
                product_id: 1, // Laptop HP ProBook
                type: 'Entrada', 
                amount: 50,
                observation: "Lote inicial de laptops por apertura de inventario.",
                moved_at: new Date(new Date().setDate(new Date().getDate() - 10)), // Movido hace 10 días
                status: true,
            },
            // --- Entrada Inicial de Martillos ---
            {
                depot_id: 1, // Almacén Central Norte
                product_id: 2, // Martillo de Uña 20oz
                type: 'Entrada', 
                amount: 100,
                observation: "Compra mayorista de herramientas básicas.",
                moved_at: new Date(new Date().setDate(new Date().getDate() - 8)), // Movido hace 8 días
                status: true,
            },
            // --- Salida (Venta/Uso Interno) de Laptops ---
            {
                depot_id: 1,
                product_id: 1, 
                type: 'Salida', 
                amount: 10,
                observation: "Venta a cliente corporativo #1234.",
                moved_at: new Date(new Date().setDate(new Date().getDate() - 5)), // Movido hace 5 días
                status: true,
            },
            // --- Salida (Transferencia) de Martillos ---
            {
                depot_id: 1,
                product_id: 2, 
                type: 'Salida', 
                amount: 20,
                observation: "Transferencia a unidad de mantenimiento (uso interno).",
                moved_at: new Date(new Date().setDate(new Date().getDate() - 2)), // Movido hace 2 días
                status: true,
            },
        ];
        
        // Simplemente insertamos los datos sin verificación de duplicados, ya que cada movimiento es único.
        // Asignamos las fechas de creación/actualización
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