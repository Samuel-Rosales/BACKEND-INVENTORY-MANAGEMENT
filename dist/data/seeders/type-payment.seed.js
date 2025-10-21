"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typePaymentSeed = void 0;
const models_1 = require("src/models");
const typePaymentSeed = async () => {
    try {
        console.log("Iniciando seed de Tipos de Pago...");
        // Los tipos de pago comunes
        const typesToCreate = [
            {
                name: "Efectivo",
            },
            {
                name: "Transferencia Bancaria",
            },
            {
                name: "Tarjeta de Débito",
            },
            {
                name: "Tarjeta de Crédito",
            },
            {
                name: "Pago Móvil",
            },
        ];
        // 1. Obtener los nombres de los tipos de pago ya existentes en la DB
        // Usamos el casting para el tipado, ya que 'name' es el identificador único
        const existingTypes = await models_1.TypePaymentDB.findAll({
            attributes: ['name']
        });
        const existingNames = existingTypes.map(type => type.name);
        // 2. Filtrar el arreglo, manteniendo solo los tipos que NO existan
        const uniqueTypesToCreate = typesToCreate.filter(type => !existingNames.includes(type.name));
        // 3. Aplicar las fechas a los tipos que serán insertados
        const finalTypes = uniqueTypesToCreate.map(type => (Object.assign(Object.assign({}, type), { createdAt: new Date(), updatedAt: new Date() })));
        if (finalTypes.length > 0) {
            // 4. Insertar SOLO los nuevos tipos de pago
            const createdTypes = await models_1.TypePaymentDB.bulkCreate(finalTypes);
            console.log(`Seed de Tipos de Pago ejecutado correctamente. Insertados: ${createdTypes.length}`);
        }
        else {
            console.log("Seed de Tipos de Pago ejecutado. No se insertaron nuevos tipos (todos ya existían).");
        }
    }
    catch (error) {
        console.error("Error al ejecutar seed de Tipos de Pago:", error);
        throw error;
    }
};
exports.typePaymentSeed = typePaymentSeed;
