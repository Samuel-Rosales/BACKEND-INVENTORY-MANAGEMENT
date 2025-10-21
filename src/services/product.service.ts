import { ProductDB, CategoryDB  } from "../config";
import { ProductInterface } from "../interfaces";

class ProductService {
    async getAll() {
        try {
            const products = await ProductDB.findAll({
                include: [{
                    model: CategoryDB, as: "category"
                }]
            });

            return { 
                status: 200,
                message: "Products obtained correctly", 
                data: products,   
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

    async getOne(product_id: number) {
        try {
            const product = await ProductDB.findByPk(product_id, {
                include: [{
                    model: CategoryDB, as: "category"
                }]
            });

            return {
                status: 200,
                message: "Product obtained correctly",
                data: product,
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

    async create(product: ProductInterface) {
        try {
            const { createdAt, updatedAt, ...productData  } = product;

            const newProduct = await ProductDB.create(productData);

            return {
                status: 201,
                message: "Product created successfully",
                data: newProduct,
            };
         } catch (error) { 
            console.error("Error creating product: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    
    async update(product_id: number, product: Partial<ProductInterface>) {
        try {
            const { createdAt, updatedAt, product_id: _, ... productData} = product;

            await ProductDB.update(productData, { where: { product_id } });

            const updatedProduct = await ProductDB.findByPk(product_id);

            return {
                status: 200,
                message: "Product update correctly",
                data: updatedProduct,
            };
        } catch (error) {
            console.error("Error updating product: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    
    async delete (product_id: number) {
        try {
            await ProductDB.destroy({ where: {product_id} });

            return { 
                status: 200,
                message: "Product deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting product: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const ProductServices = new ProductService();