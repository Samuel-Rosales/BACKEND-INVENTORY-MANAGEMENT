"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerSeed = void 0;
const config_1 = require("src/config");
const providerSeed = async () => {
    try {
        console.log("Iniciando seed de Proveedores...");
        const providersToCreate = [
            {
                name: "Tecno Suministros C.A.",
                located: "Avenida Sur, Galpón 4A, Zona Industrial",
            },
            {
                name: "Distribuidora Universal",
                located: "Calle 15, Edificio Mercantil, Piso 2, Oficina 201",
            },
            {
                name: "Servicios Generales LTDA",
                located: "Carretera Nacional, KM 5, Centro Comercial El Oasis",
            },
            {
                name: "Materiales e Insumos Rápidos",
                located: "Zona Franca, Lote 12, Bodega B",
            },
        ];
        // 1. Obtener los nombres de los proveedores ya existentes en la DB
        // Usamos el casting para que TypeScript reconozca la propiedad 'name'
        const existingProviders = await config_1.ProviderDB.findAll({
            attributes: ['name']
        });
        const existingNames = existingProviders.map(provider => provider.name);
        // 2. Filtrar el arreglo, manteniendo solo los proveedores cuyos nombres NO existan
        const uniqueProvidersToCreate = providersToCreate.filter(provider => !existingNames.includes(provider.name));
        // 3. Aplicar las fechas a los proveedores que serán insertados
        const finalProviders = uniqueProvidersToCreate.map(provider => (Object.assign(Object.assign({}, provider), { createdAt: new Date(), updatedAt: new Date() })));
        if (finalProviders.length > 0) {
            // 4. Insertar SOLO los nuevos proveedores
            const createdProviders = await config_1.ProviderDB.bulkCreate(finalProviders);
            console.log(`Seed de Proveedores ejecutado correctamente. Insertados: ${createdProviders.length}`);
        }
        else {
            console.log("Seed de Proveedores ejecutado. No se insertaron nuevos proveedores (todos ya existían).");
        }
    }
    catch (error) {
        console.error("Error al ejecutar seed de Proveedores:", error);
        throw error;
    }
};
exports.providerSeed = providerSeed;
