export interface SaleItemInterface {
    sale_item_id: number;
    product_id: number;
    sale_id: number;
    unit_cost: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}