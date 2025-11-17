
interface GeneralItem {
    item_id: number;
    product_id: number;
    depot_id: number;
    amount: number;
    unit_cost: number;
    is_perishable: boolean;
}

interface LotItem extends GeneralItem {
    expiration_date: Date;
}

export interface PurchaseInterface {
    purchase_id: number;
    provider_id: number;
    user_ci: string;
    type_payment_id: number;
    bought_at: Date;
    total_usd: number;
    exchange_rate: number;
    total_ves: number;
    status: 'Pendiente' | 'Aprobado';
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    purchase_items: Array<GeneralItem | LotItem>;
}

/*export function isLotItem(item: GeneralItem | LotItem): item is LotItem {
    return (item as any).expiration_date !== undefined && (item as any).expiration_date !== null;
}*/