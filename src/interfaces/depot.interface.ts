export interface DepotInterface {
    depot_id: number;
    name: string;
    location: string;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}