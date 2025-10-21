import { CategoryDB } from "../models";
import { CategoryInterface } from "../interfaces";

class CategoryService {
    async getAll() {
        try {
            const categories = await CategoryDB.findAll();

            return {
                status: 200,
                message: "Categories obtained correctly",
                data: categories,
            };
        } catch (error) {
            console.error("Error fetching products: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(category_id: number) {
        try { 
            const category = await CategoryDB.findByPk(category_id);

            if(!category) {
                return {
                    status: 404,
                    message: "Category not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Category obtained correctly",
                data: category,
            };
        } catch (error) {
            console.error("Error fetching product: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async create(category: CategoryInterface) {
        try {
            const { createdAt, updatedAt, category_id, ...categoryData } = category;

            const newCategory = await CategoryDB.create(categoryData);

            return {
                status: 201,
                message: "Category created correctly",
                data: newCategory,
            };
        } catch (error) {
            console.error("Error creating category: ", error);

            return {
                status: 500,
                message: "Internal sever error",
                data: null,
            };
        }
    }

    async update(category_id: number, category: Partial<CategoryInterface>) {
            try {
                const { createdAt, updatedAt, category_id: _, ... categorytData} = category;
    
                await CategoryDB.update(categorytData, { where: { category_id } });
    
                const updatedCategory = await CategoryDB.findByPk(category_id);
    
                return {
                    status: 200,
                    message: "Category update correctly",
                    data: updatedCategory,
                };
            } catch (error) {
                console.error("Error updating category: ", error);
    
                return {
                    status: 500,
                    message: "Internal server error",
                    data: null,
                };
            }
        }

    async delete (category_id: number) {
        try {
            const category = await CategoryDB.destroy({ where:  {category_id} });

            return {
                status: 200,
                message: "Category deleted successfully"
            };
        } catch (error) { 
            console.error("Error deleting category: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    }
}

export const CategoryServices = new CategoryService();