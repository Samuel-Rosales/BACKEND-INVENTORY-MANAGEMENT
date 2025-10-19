import { ProductDB, CategoryDB  } from "../config";
import { ProductInterface } from "../interfaces";

class ProductService {
    async getAll() {
        try {
            const products = await ProductDB.findAll({
                include: { model: CategoryDB }
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
                include: { model: CategoryDB },
            });

            if (!product) {
                return {
                    status: 404,
                    message: "Product not found",
                    data: null,
                };
            }

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

    async create (product: ProductInterface) {
        try {
            const { createdAt, updatedAt, ...productData  } = product;

            const newProduct = await ProductDB.create(productData as any);

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
    //mas adelante me encargo de ver como funciona las actualziaciones para saber si poner put o patch

    
    async delete ( product_id: number) {
        try {
            const product = await ProductDB.findByPk(product_id);

            if(!product) {
                return {
                    status: 404,
                    message: "Product not found",
                    data: null,
                };
            }
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