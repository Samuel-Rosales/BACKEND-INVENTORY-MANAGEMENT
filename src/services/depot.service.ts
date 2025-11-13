import { DepotDB } from "../models";
import { DepotInterface } from "../interfaces";

class DepotService {
    async getAll() {
        try {
            const depots = await DepotDB.findAll();

            return {
                status: 200,
                message: "Depots obtained correctly",
                data: depots,
            };
        } catch (error) {
            console.error("Error fetching depots: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(depot_id: number) {
        try {
            const depot = await DepotDB.findByPk(depot_id);

            return {
                status: 200,
                message: "Depot obtained correctly",
                data: depot,
            };
        } catch (error) {
            console.error("Error fetching depot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async create(depot: DepotInterface) {
        try {
            const { createdAt, updatedAt, depot_id, ...depotData } = depot;

            const newDepot = await DepotDB.create(depotData);

            return {
                status: 201,
                message: "Depot created correctly",
                data: newDepot,
            };
        } catch (error) {
            console.error("Error creating depot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(depot_id: number, depot: Partial<DepotInterface>) {
        try {
            const { createdAt, updatedAt, depot_id: _, ...depotData } = depot;

            await DepotDB.update(depotData, { where: { depot_id } });

            const updatedDepot = await DepotDB.findByPk(depot_id);

            return {
                status: 200,
                message: "Depot updated correctly",
                data: updatedDepot,   
            };
        } catch (error) {
            console.error("Error updating depot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async updateDeactivate(depot_id: number) {
        try{
            const depot = await DepotDB.findByPk(depot_id);
            
            if(!depot) {
                return {
                    status: 404,
                    message: "Depot not found",
                    data: null,
                };
            }

            depot.update({ status: false });
            return {
                status: 200,
                message: "Depot deactivated successfully",
                data: depot,
            };
        } catch (error) {
            console.error("Error deactivating depot: ", error);
            
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    } 

    async updateActivate(depot_id: number) {
        try{
            const depot = await DepotDB.findByPk(depot_id);

            if(!depot) {
                return {
                    status: 404,
                    message: "Depot not found",
                    data: null,
                };
            }

            await depot.update({ status: true });

            return {
                status: 200,
                message: "Depot activated successfully",
                data: depot,
            };
        } catch (error) {
            console.error("Error activating depot: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }   
    }

    //funcion mejorada para verfificar que si lo eliminó
    async delete(depot_id: number) {
        try {
            const deletedCount = await DepotDB.destroy({ where: { depot_id } });

            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Depot not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Depot deleted successfully",
                data: null,
            };
        } catch (error) {
            console.error("Error deleting depot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const DepotServices = new DepotService();