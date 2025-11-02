export interface StockLotInterface {
    stock_lot_id: number;
    product_id: number;
    depot_id: number;
    expiration_date: Date;
    amount: number;
    cost_lot: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}