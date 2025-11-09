export interface SaleInterface {
    sale_id: number;
    client_ci: string;
    user_ci: string;
    type_payment_id: number;
    total_usd: number;
    exchange_rate: number;
    total_ves: number;
    sold_at: Date;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}