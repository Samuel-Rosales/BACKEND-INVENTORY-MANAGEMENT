export interface CategoryInterface {
    category_id: number;
    name: string;
    description: string;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}