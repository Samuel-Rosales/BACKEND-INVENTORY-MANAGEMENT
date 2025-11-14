export interface ProviderInterface {
    provider_id: number;
    name: string;
    located: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}