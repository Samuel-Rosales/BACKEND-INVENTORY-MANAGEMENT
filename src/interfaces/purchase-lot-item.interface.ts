export interface PurchaseLotItemInterface {
    purchase_lot_id: number;
    product_id: number;
    purchase_id: number;
    depot_id: number;
    unit_cost: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}