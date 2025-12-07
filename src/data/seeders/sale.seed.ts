import { SaleDB, ClientDB, UserDB } from "src/models";

export const saleSeed = async () => {
    try {
        console.log("💰 Iniciando seed de Ventas (Historial de 60 días)...");

        const clients = await ClientDB.findAll({ attributes: ['client_ci'] });
        const users = await UserDB.findAll({ attributes: ['user_ci'] });

        if (clients.length === 0 || users.length === 0) {
            throw new Error("❌ Error: Faltan Clientes o Usuarios.");
        }

        const clientCIs = clients.map(c => (c as any).client_ci);
        const userCIs = users.map(u => (u as any).user_ci);

        const salesToCreate = [];
        const DAYS_TO_SIMULATE = 60; 
        const MAX_SALES_PER_DAY = 8; // Más volumen para mejores gráficos

        const today = new Date();

        // Generar ventas hacia atrás en el tiempo
        for (let i = 0; i < DAYS_TO_SIMULATE; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Ventas aleatorias por día (0 a 8)
            const salesCount = Math.floor(Math.random() * (MAX_SALES_PER_DAY + 1));

            for (let j = 0; j < salesCount; j++) {
                // Cliente aleatorio
                const selectedClientCI = clientCIs[Math.floor(Math.random() * clientCIs.length)];
                // Vendedor aleatorio
                const selectedUserCI = userCIs[Math.floor(Math.random() * userCIs.length)];
                
                // Hora aleatoria (08:00 - 18:00)
                const saleDate = new Date(date);
                saleDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

                const exchangeRate = 200.5 + (Math.random() * 0.5);

                salesToCreate.push({
                    client_ci: selectedClientCI,
                    user_ci: selectedUserCI,
                    type_payment_id: Math.floor(Math.random() * 5) + 1,
                    sold_at: saleDate,
                    status: true,
                    total_usd: 0, // Se calculará en el siguiente seed
                    exchange_rate: parseFloat(exchangeRate.toFixed(2)),
                    total_ves: 0,
                });
            }
        }

        if (salesToCreate.length > 0) {
            await SaleDB.bulkCreate(salesToCreate); 
            console.log(`✅ ${salesToCreate.length} ventas históricas generadas.`);
        }

    } catch (error) {
        console.error("❌ Error en seed de Ventas:", error);
        throw error;
    }
};