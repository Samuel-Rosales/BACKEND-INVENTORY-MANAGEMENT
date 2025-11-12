import { ClientDB} from "../models";
import { ClientInterface } from "../interfaces";

class ClientService {
    async getAll() {
        try { 
            const clients = await ClientDB.findAll();

        return { 
            status: 200,
            message: "Clients obtained correctly", 
            data: clients,   
        };
        } catch (error) {
            console.error("Error fetching clients: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }


    async getOne (client_id: string) {
        try {
            const client = await ClientDB.findByPk(client_id);

            return {
                status: 200,
                message: "Client obtained correctly",
                data: client,
            };
        } catch (error) {
            console.error("Error fetching client: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(client: ClientInterface) {
        try {
            const { createdAt, updatedAt, ...clientData  } = client;

            const newClient = await ClientDB.create(clientData);

            return {
                status: 201,
                message: "Client created successfully",
                data: newClient,
            };
        } catch (error) { 
            console.error("Error creating client: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update (client_ci: string, client: Partial<ClientInterface> ) {
        try {
            const { createdAt, updatedAt, client_ci: _, ... clientData} = client;

            await ClientDB.update(clientData, { where: { client_ci } });

            const updatedClient = await ClientDB.findByPk(client_ci);

            return {
                status: 200,
                message: "Client update correctly",
                data: updatedClient,
            };
        } catch (error) {
            console.error("Error updating client: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }   
    }

    async delete (client_ci: string) {
        try {
            await ClientDB.destroy({ where: {client_ci} });

            return { 
                status: 200,
                message: "Client deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting client: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const ClientServices = new ClientService();