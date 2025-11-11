export interface StockGeneralInterface {
    product_id: number;
    depot_id: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}