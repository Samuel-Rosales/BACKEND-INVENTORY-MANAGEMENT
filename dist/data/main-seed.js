"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainSeed = void 0;
require("dotenv/config");
const config_1 = require("../config");
const seeders_1 = require("./seeders");
const mainSeed = async () => {
    try {
        console.log("🚀 Iniciando el proceso de seeding completo...");
        // --- NIVEL 1: Modelos sin dependencias ---
        console.log("\n--- Ejecutando Nivel 1: Datos Base ---");
        await (0, seeders_1.rolSeed)();
        await (0, seeders_1.typePaymentSeed)();
        await (0, seeders_1.categorySeed)();
        await (0, seeders_1.depotSeed)();
        await (0, seeders_1.clientSeed)();
        await (0, seeders_1.providerSeed)();
        // --- NIVEL 2: Modelos que dependen del Nivel 1 ---
        console.log("\n--- Ejecutando Nivel 2: Usuarios y Productos ---");
        await (0, seeders_1.userSeed)(); // Depende de 'rolSeed'
        await (0, seeders_1.productSeed)(); // Depende de 'categorySeed'
        // --- NIVEL 3: Modelos de Transacciones (Cabeceras) ---
        console.log("\n--- Ejecutando Nivel 3: Transacciones ---");
        await (0, seeders_1.purchaseSeed)(); // Depende de 'providerSeed', 'userSeed', 'typePaymentSeed'
        await (0, seeders_1.saleSeed)(); // Depende de 'clientSeed', 'userSeed', 'typePaymentSeed'
        await (0, seeders_1.movementSeed)(); // Depende de 'depotSeed', 'productSeed'
        // --- NIVEL 4: Modelos de Detalles de Transacciones ---
        console.log("\n--- Ejecutando Nivel 4: Detalles de Transacciones ---");
        await (0, seeders_1.purchaseDetailSeed)(); // Depende de 'purchaseSeed' y 'productSeed'
        await (0, seeders_1.saleDetailSeed)(); // Depende de 'saleSeed' y 'productSeed'
        console.log("\n✅ Proceso de seeding completado exitosamente.");
    }
    catch (error) {
        console.error("❌ Error catastrófico durante el proceso de seeding:", error);
        throw error; // Propaga el error para detener cualquier proceso posterior
    }
};
exports.mainSeed = mainSeed;
const resetDatabase = async () => {
    console.log("⚠️  ADVERTENCIA: Reiniciando la base de datos... Se perderán todos los datos.");
    try {
        // La opción force: true borra y recrea las tablas. ¡Solo para desarrollo!
        await config_1.db.sync({ force: true });
        console.log("🔄 Base de datos reiniciada exitosamente.");
    }
    catch (error) {
        console.error("❌ Error al reiniciar la base de datos:", error);
        throw error;
    }
};
const runSeeders = async () => {
    try {
        console.log("Ejecutando seeders...");
        await config_1.db.authenticate();
        console.log("Conexión exitosa a la base de datos");
        await (0, exports.mainSeed)();
        console.log("Seeders ejecutados correctamente");
    }
    catch (error) {
        console.error("Error durante la ejecución de seeders:", error);
        throw error;
    }
};
const main = async () => {
    try {
        const shouldReset = process.argv.includes('--reset');
        if (shouldReset) {
            await resetDatabase();
        }
        await runSeeders();
        console.log("Script de seeders finalizado con éxito.");
        process.exit(0);
    }
    catch (error) {
        console.error("El script de seeders falló:", error);
        process.exit(1);
    }
};
// Inicia la ejecución
main();
