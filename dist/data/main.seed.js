"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainSeed = void 0;
require("dotenv/config");
const config_1 = require("src/config");
const seeders_1 = require("./seeders");
const mainSeed = async () => {
    try {
        console.log("🚀 Starting the full seeding process...");
        // --- LEVEL 1: Models without dependencies ---
        console.log("\n--- Running Level 1: Base Data ---");
        await (0, seeders_1.rolSeed)();
        await (0, seeders_1.typePaymentSeed)();
        await (0, seeders_1.categorySeed)();
        await (0, seeders_1.depotSeed)();
        await (0, seeders_1.clientSeed)();
        await (0, seeders_1.providerSeed)();
        // --- LEVEL 2: Models dependent on Level 1 ---
        console.log("\n--- Running Level 2: Users and Products ---");
        await (0, seeders_1.userSeed)(); // Depends on 'rolSeed'
        await (0, seeders_1.productSeed)(); // Depends on 'categorySeed'
        // --- LEVEL 3: Transaction Models (Headers) ---
        console.log("\n--- Running Level 3: Transactions ---");
        await (0, seeders_1.purchaseSeed)(); // Depends on 'providerSeed', 'userSeed', 'typePaymentSeed'
        await (0, seeders_1.saleSeed)(); // Depends on 'clientSeed', 'userSeed', 'typePaymentSeed'
        await (0, seeders_1.movementSeed)(); // Depends on 'depotSeed', 'productSeed'
        // --- LEVEL 4: Transaction Detail Models ---
        console.log("\n--- Running Level 4: Transaction Details ---");
        await (0, seeders_1.purchaseDetailSeed)(); // Depends on 'purchaseSeed' and 'productSeed'
        await (0, seeders_1.saleDetailSeed)(); // Depends on 'saleSeed' and 'productSeed'
        console.log("\n✅ Seeding process completed successfully.");
    }
    catch (error) {
        console.error("❌ Catastrophic error during the seeding process:", error);
        throw error; // Propagate the error to stop any subsequent process
    }
};
exports.mainSeed = mainSeed;
const resetDatabase = async () => {
    console.log("⚠️  WARNING: Resetting the database... All data will be lost.");
    try {
        // force: true will DROP all tables and recreate them
        await config_1.db.sync({ force: true });
        console.log("🔄 Database reset successfully.");
    }
    catch (error) {
        console.error("❌ Error resetting the database:", error);
        throw error;
    }
};
const runSeeders = async () => {
    try {
        console.log("Running seeders...");
        await config_1.db.authenticate();
        console.log("Successfully connected to the database");
        await (0, exports.mainSeed)();
        console.log("Seeders executed successfully");
    }
    catch (error) {
        console.error("Error during seeder execution:", error);
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
        console.log("Seeder script finished successfully.");
        process.exit(0);
    }
    catch (error) {
        console.error("The seeder script failed:", error);
        process.exit(1);
    }
};
// Start execution
main();
