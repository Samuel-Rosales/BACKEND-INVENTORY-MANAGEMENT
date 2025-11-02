export interface PurchaseGeneralItemInterface {
    purchase_general_id: number;
    product_id: number;
    purchase_id: number;
    unit_cost: number;
    amount: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}