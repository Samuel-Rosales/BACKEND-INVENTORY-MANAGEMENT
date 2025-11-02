"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseDetailSeed = void 0;
const models_1 = require("src/models");
const purchaseDetailSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra...");
        const detailsToCreate = [
            // --- Detalles para la Compra ID 1 ---
            { purchase_id: 1, product_id: 1, unit_cost: 750.00, amount: 10, status: true },
            { purchase_id: 1, product_id: 2, unit_cost: 160.00, amount: 15, status: true },
            // --- Detalles para la Compra ID 2 ---
            { purchase_id: 2, product_id: 7, unit_cost: 4.50, amount: 200, status: true },
            // --- NUEVOS DETALLES ---
            // --- Detalles para la Compra ID 3 (hecha por Edgar Briceño) ---
            { purchase_id: 3, product_id: 9, unit_cost: 16.50, amount: 50, status: true }, // Guantes de Seguridad
            // --- Detalles para la Compra ID 4 (hecha por Jesús Ramos) ---
            { purchase_id: 4, product_id: 8, unit_cost: 42.00, amount: 20, status: true }, // Toner Negro
            { purchase_id: 4, product_id: 4, unit_cost: 11.50, amount: 40, status: true }, // Destornillador
            // --- Detalles para la Compra ID 5 (hecha por Samuel Rosales) ---
            { purchase_id: 5, product_id: 5, unit_cost: 145.00, amount: 12, status: true }, // Silla Ergonómica
        ];
        // --- Lógica de inserción ---
        const finalDetails = detailsToCreate.map(detail => (Object.assign(Object.assign({}, detail), { createdAt: new Date(), updatedAt: new Date() })));
        const createdDetails = await models_1.PurchaseGeneralItemDB.bulkCreate(finalDetails);
        console.log(`Seed de Detalles de Compra ejecutado correctamente. Insertados: ${createdDetails.length} detalles.`);
    }
    catch (error) {
        console.error("Error al ejecutar seed de Detalles de Compra:", error);
        throw error;
    }
};
exports.purchaseDetailSeed = purchaseDetailSeed;
