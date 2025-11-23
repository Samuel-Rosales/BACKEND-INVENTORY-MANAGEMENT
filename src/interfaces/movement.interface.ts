export interface MovementInterface {
    movement_id: number;
    depot_id: number;
    product_id: number;
    user_ci: string;
    type: 'Compra' | 'Venta' | 'Ajuste Negativo' | 'Ajuste Positivo';
    amount: number;
    observation: string;
    moved_at: Date;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;   
}