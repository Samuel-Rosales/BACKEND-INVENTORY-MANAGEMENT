import { ProviderDB} from "../config";
import { ProviderInterface } from "../interfaces";

class ProviderService {
    async getAll() {
        try { 
            const providers = await ProviderDB.findAll();

        return { 
            status: 200,
            message: "Providers obtained correctly", 
            data: providers,   
        };
        } catch (error) {
            console.error("Error fetching providers: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }


    async getOne (provider_id: number) {
        try {
            const provider = await ProviderDB.findByPk(provider_id);

            return {
                status: 200,
                message: "Provider obtained correctly",
                data: provider,
            };
        } catch (error) {
            console.error("Error fetching provider: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(provider: ProviderInterface) {
        try {
            const { createdAt, updatedAt, ...providerData  } = provider;

            const newProvider = await ProviderDB.create(providerData);

            return {
                status: 201,
                message: "Provider created successfully",
                data: newProvider,
            };
        } catch (error) { 
            console.error("Error creating provider: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update (provider_id: number, provider: Partial<ProviderInterface> ) {
        try {
            const { createdAt, updatedAt, ... providerData} = provider;

            await ProviderDB.update(providerData, { where: { provider_id } });

            const updatedProvider = await ProviderDB.findByPk(provider_id);

            return {
                status: 200,
                message: "Provider update correctly",
                data: updatedProvider,
            };
        } catch (error) {
            console.error("Error updating provider: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }   
    }

    async delete (provider_id: number) {
        try {
            await ProviderDB.destroy({ where: {provider_id} });

            return { 
                status: 200,
                message: "Provider deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting provider: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const ProviderServices = new ProviderService();