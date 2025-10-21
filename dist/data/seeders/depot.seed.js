"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depotSeed = void 0;
const models_1 = require("src/models");
const depotSeed = async () => {
    try {
        console.log("Starting depot seeds...");
        const depotsToCreate = [
            {
                name: "Almacén Central Norte",
                location: "Avenida 5, Galpón N° 12, Zona Industrial Norte",
                status: true, // Activo
            },
            {
                name: "Depósito Regional Sur",
                location: "Carretera Panamericana, KM 25, Municipio Libertador",
                status: true, // Activo
            },
            {
                name: "Mini-Hub de Distribución Este",
                location: "Calle Los Pinos, Centro Comercial Metropolitano, Nivel Sótano",
                status: true, // Activo
            },
            {
                name: "Reserva Temporal Oeste",
                location: "Parcela B-4, Vía Intercomunal del Oeste. (Solo inventario de seguridad)",
                status: false, // Inactivo/Mantenimiento
            },
            {
                name: "Taller y Stock de Repuestos",
                location: "Calle 10, Edificio El Sol, Nivel Mezzanina. (Stock Interno)",
                status: true, // Activo
            },
        ];
        // 1. Obtener los nombres de los depósitos ya existentes en la DB
        const existingDepots = await models_1.DepotDB.findAll({
            attributes: ['name']
        });
        const existingNames = existingDepots.map(depot => depot.name);
        // 2. Filtrar el arreglo, manteniendo solo los depósitos que NO existan
        const uniqueDepotsToCreate = depotsToCreate.filter(depot => !existingNames.includes(depot.name));
        // 3. Aplicar las fechas (solo a los depósitos únicos que serán creados)
        const finalDepots = uniqueDepotsToCreate.map(depot => (Object.assign(Object.assign({}, depot), { createdAt: new Date(), updatedAt: new Date() })));
        if (finalDepots.length > 0) {
            // 4. Insertar SOLO los nuevos depósitos
            const createdDepots = await models_1.DepotDB.bulkCreate(finalDepots);
            console.log(`Seed de Depósitos ejecutado correctamente. Insertados: ${createdDepots.length}`);
        }
        else {
            console.log("Seed de Depósitos ejecutado. No se insertaron nuevos depósitos (todos ya existían).");
        }
    }
    catch (error) {
        console.error("Error al ejecutar seed de Depósitos:", error);
        throw error;
    }
};
exports.depotSeed = depotSeed;
