export interface PurchaseInterface {
    purchase_id: number;
    provider_id: number;
    user_ci: string;
    type_payment_id: number;
    bought_at: Date;
    createdAt?: Date;
    updatedAt?: Date;
}