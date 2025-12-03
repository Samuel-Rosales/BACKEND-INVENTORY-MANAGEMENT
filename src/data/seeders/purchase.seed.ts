import { PurchaseDB, UserDB } from "src/models";

export const purchaseSeed = async () => {
    try {
        console.log("🚚 Iniciando seed de Compras (Abastecimiento)...");

        // Necesitamos usuarios (Admin/Gerente) para registrar quien compró
        const users = await UserDB.findAll({ attributes: ['user_ci'] });
        if (users.length === 0) throw new Error("❌ Faltan Usuarios.");
        const userCIs = users.map(u => (u as any).user_ci);

        // Simulamos 3 Proveedores fijos (IDs 1, 2, 3)
        // Asumimos que ya existen en tu DB o se crearán con un providerSeed básico
        const providerIds = [1, 2, 3]; 

        const purchasesToCreate = [];
        const DAYS_TO_SIMULATE = 90; // Empezamos a comprar hace 3 meses

        // Generamos compras dispersas
        for (let i = 0; i < DAYS_TO_SIMULATE; i+=2) { // Una compra cada 2 días aprox
            const date = new Date();
            date.setDate(date.getDate() - i); // Ir hacia atrás

            // Elegir Proveedor y Usuario Random
            const providerId = providerIds[Math.floor(Math.random() * providerIds.length)];
            const userCI = userCIs[Math.floor(Math.random() * userCIs.length)];

            // Tasa de cambio variable
            const exchangeRate = 36.0 + (Math.random() * 1.0);

            purchasesToCreate.push({
                provider_id: providerId,
                user_ci: userCI,
                type_payment_id: 2, // Transferencia por defecto
                bought_at: date,
                status: 'Aprobado',
                active: true,
                total_usd: 0, // Se calculará después al insertar los items
                exchange_rate: parseFloat(exchangeRate.toFixed(2)),
                total_ves: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (purchasesToCreate.length > 0) {
            await PurchaseDB.bulkCreate(purchasesToCreate);
            console.log(`✅ ${purchasesToCreate.length} compras (cabeceras) generadas.`);
        }

    } catch (error) {
        console.error("❌ Error en seed de Compras:", error);
        throw error;
    }
};