export interface SaleItemInterface {
    sale_item_id: number;
    product_id: number;
    sale_id: number;
    unit_price_usd: number;
    unit_price_bs: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}