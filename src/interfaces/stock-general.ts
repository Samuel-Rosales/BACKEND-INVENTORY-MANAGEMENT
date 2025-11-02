export interface StockGeneralInterface {
    product_id: number;
    depot_id: number;
    quantity: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}