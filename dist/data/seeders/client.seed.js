"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSeed = void 0;
const config_1 = require("src/config");
const clientSeed = async () => {
    try {
        console.log("Iniciando seed de Clientes...");
        const clientsToCreate = [
            {
                client_ci: "12345678",
                name: "Ana María Pérez",
                phone: "04121112233",
                address: "Calle Los Girasoles, Edificio Apto 5B, Urb. Centro",
                status: true,
            },
            {
                client_ci: "20987654",
                name: "Roberto Gómez Bolaños",
                phone: "04144445566",
                address: "Av. Principal, Quinta Los Robles, Sector Este",
                status: true,
            },
            {
                client_ci: "08765432",
                name: "Sofía Hernández García",
                phone: "04267778899",
                address: "Calle 3, Local 10, Casco Histórico",
                status: true,
            },
            {
                client_ci: "25135790",
                name: "Elsa Martínez",
                phone: "04240001122",
                address: "Urbanización El Sol, Casa N° 12",
                status: false, // Cliente inactivo de prueba
            },
        ];
        // 1. Obtener las cédulas de los clientes ya existentes en la DB
        // Usamos el casting para que TypeScript reconozca la propiedad 'client_ci'
        const existingClients = await config_1.ClientDB.findAll({
            attributes: ['client_ci']
        });
        const existingCIs = existingClients.map(client => client.client_ci);
        // 2. Filtrar el arreglo, manteniendo solo los clientes cuyas CIs NO existan
        const uniqueClientsToCreate = clientsToCreate.filter(client => !existingCIs.includes(client.client_ci));
        // 3. Aplicar las fechas a los clientes que serán insertados
        const finalClients = uniqueClientsToCreate.map(client => (Object.assign(Object.assign({}, client), { createdAt: new Date(), updatedAt: new Date() })));
        if (finalClients.length > 0) {
            // 4. Insertar SOLO los nuevos clientes
            const createdClients = await config_1.ClientDB.bulkCreate(finalClients);
            console.log(`Seed de Clientes ejecutado correctamente. Insertados: ${createdClients.length}`);
        }
        else {
            console.log("Seed de Clientes ejecutado. No se insertaron nuevos clientes (todos ya existían).");
        }
    }
    catch (error) {
        console.error("Error al ejecutar seed de Clientes:", error);
        throw error;
    }
};
exports.clientSeed = clientSeed;
