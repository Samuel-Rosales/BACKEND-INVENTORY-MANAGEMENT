export interface MovementInterface {
    movement_id: number;
    depot_id: number;
    product_id: number;
    type: 'Entrada' | 'Salida';
    amount: number;
    observation: string;
    date: Date;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;   
}