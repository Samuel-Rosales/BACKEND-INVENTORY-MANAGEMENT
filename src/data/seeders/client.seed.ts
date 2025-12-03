import { ClientDB } from "src/models";

export const clientSeed = async () => {
    try {
        console.log("👥 Iniciando seed de Clientes (Masivo)...");

        // 1. Clientes Reales / Manuales
        const specificClients = [
            { client_ci: "12345678", name: "Ana María Pérez", phone: "04121112233", address: "Calle Los Girasoles", status: true },
            { client_ci: "20987654", name: "Roberto Gómez Bolaños", phone: "04144445566", address: "Av. Principal", status: true },
            { client_ci: "08765432", name: "Sofía Hernández", phone: "04267778899", address: "Casco Histórico", status: true },
            { client_ci: "25135790", name: "Elsa Martínez", phone: "04240001122", address: "Urb. El Sol", status: false },
        ];

        // 2. Generar 50 Clientes "Dummy" para llenar gráficas
        const dummyClients = [];
        for (let i = 1; i <= 50; i++) {
            const randomCI = (30000000 + i).toString(); 
            dummyClients.push({
                client_ci: randomCI,
                name: `Cliente Frecuente ${i}`,
                phone: `0412000${i.toString().padStart(4, '0')}`,
                address: `Zona Residencial #${i}`,
                status: true
            });
        }

        const allClients = [...specificClients, ...dummyClients];

        // 3. Verificar existencia para no duplicar
        const existingClients = await ClientDB.findAll({ attributes: ['client_ci'] });
        const existingCIs = new Set(existingClients.map(c => (c as any).client_ci));

        const newClients = allClients.filter(c => !existingCIs.has(c.client_ci));

        // 4. Insertar
        if (newClients.length > 0) {
            const finalClients = newClients.map(c => ({
                ...c,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            const created = await ClientDB.bulkCreate(finalClients);
            console.log(`✅ ${created.length} Clientes insertados.`);
        } else {
            console.log("ℹ️ No hay clientes nuevos por insertar.");
        }

    } catch (error) {
        console.error("❌ Error en seed de Clientes:", error);
        throw error;
    }
};