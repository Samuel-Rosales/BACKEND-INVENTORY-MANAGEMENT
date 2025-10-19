export interface ProductInterface {
    product_id: number;
    name: string;
    description: string;
    category_id: number;
    base_price: number;
    min_stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}