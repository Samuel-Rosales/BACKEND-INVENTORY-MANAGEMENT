export interface ProductInterface {
    product_id: number;
    name: string;
    description: string;
    category_id: number;
    base_price: number;
    min_stock: number;
    status: boolean;
    image_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
}