export interface PurchaseDetailInterface {
    purchase_detail_id: number;
    product_id: number;
    purchase_id: number;
    unit_cost: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}