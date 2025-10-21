import { TypePaymentDB } from "../models";
import { TypePaymentInterface } from "../interfaces";

class TypePaymentService {
    async getAll() {
        try {
            const typesPaymets = await TypePaymentDB.findAll();

            return { 
                status: 200,
                message: "Types payments obtained correctly", 
                data: typesPaymets,   
            };
        } catch (error) {
            console.error("Error fetching Types payments: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne (type_payment_id: number) {
        try {
            const typePayment = await TypePaymentDB.findByPk(type_payment_id);

            return {
                status: 200,
                message: "Type payment obtained correctly",
                data: typePayment,
            };
        } catch (error) {
            console.error("Error fetching type payment: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(typePayment: TypePaymentInterface) {
        try {
            const { createdAt, updatedAt, ...typePaymentData } = typePayment;

            const newTypePayment = await TypePaymentDB.create(typePaymentData);

            return {
                status: 201,
                message: "Type payment created successfully",
                data: newTypePayment,
            };
            } catch (error) { 
            console.error("Error creating type payment: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update (type_payment_id: number, typePayment: Partial<TypePaymentInterface>) {
        try {
            const { createdAt, updatedAt, type_payment_id: _, ... typePaymentData} = typePayment;

            await TypePaymentDB.update(typePaymentData, { where: { type_payment_id } });

            const updatedTypePayment = await TypePaymentDB.findByPk(type_payment_id);

            return {
                status: 200,
                message: "Type payment update correctly",
                data: updatedTypePayment,
            };
        } catch (error) {
            console.error("Error updating type payment: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    }

    async delete ( type_payment_id: number) {
        try {
            await TypePaymentDB.destroy({ where: {type_payment_id} });

            return { 
                status: 200,
                message: "Type payment deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting type payment: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const TypePaymentServices = new TypePaymentService();