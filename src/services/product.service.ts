import { ProductDB, CategoryDB, StockGeneralDB, StockLotDB  } from "../models";
import { ProductInterface, StockGeneralInterface, StockLotInterface } from "../interfaces";
import { ExchangeRateServices } from "./exchange-rate.service";

class ProductService {
    async getAll() {
        try {
            const rateResponse = await ExchangeRateServices.getCurrentRate();

            // Valida la respuesta del servicio
            if (rateResponse.status !== 200) {
                return {
                    status: rateResponse.status,
                    message: rateResponse.message,                
                    data: null,
                };
            }

            const rateModel = rateResponse.data;
            if (!rateModel) {
                console.error("Exchange rate data is null or undefined");
                return {
                    status: 500,
                    message: "Exchange rate data not found",
                    data: null,
                };
            }

            const tasa = parseFloat(rateModel.get('rate') as string);

            const products = await ProductDB.findAll({
                include: [
                    {model: CategoryDB, as: "category"},
                    {model: StockGeneralDB, as: "stock_generals"},
                    {model: StockLotDB, as: "stock_lots"},
                ]
            });

            const productsWithBsAndTotal = products.map(product => {
                
                let total_stock = 0;

                const simpleProduct = product.toJSON() as ProductInterface & { stock_generals: StockGeneralInterface[] } & { stock_lots: StockLotInterface[] };
                
                const price_bs = simpleProduct.base_price * tasa;

                if (!simpleProduct.perishable) {
    
                    total_stock = simpleProduct.stock_generals.reduce((accumulator, stock) =>{
                        return accumulator + stock.amount;
                    }, 0);
                } else {

                    total_stock = simpleProduct.stock_lots.reduce((accumlator, stock) =>{
                        return accumlator + stock.amount;
                    },0);
                }

                return {
                    ...product,
                    price_bs: parseFloat(price_bs.toFixed(2)), // Redondea a 2 decimales
                    total_stock: total_stock,
                };
            });

            return { 
                status: 200,
                message: "Products obtained correctly", 
                data: productsWithBsAndTotal,   
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
            // 1. Llama al servicio centralizado para obtener la tasa
            const rateResponse = await ExchangeRateServices.getCurrentRate();

            // 2. Valida la respuesta del servicio de tasas
            if (rateResponse.status !== 200) {
                return {
                    status: rateResponse.status,
                    message: rateResponse.message,
                    data: null,
                };
            }

            // 3. Extrae el valor numérico de la tasa
            const tasaModel = rateResponse.data;
            if (!tasaModel) {
                console.error("Exchange rate data is null or undefined");
                return {
                    status: 500,
                    message: "Exchange rate data not found",
                    data: null,
                };
            }
            const tasa = parseFloat(tasaModel.get('tasa') as string);

            // 4. Obtiene el producto de la DB
            const product = await ProductDB.findByPk(product_id, {
                include: [
                    { model: CategoryDB, as: "category" },
                    {model: StockGeneralDB, as: "stock_generals"},
                    {model: StockLotDB, as: "stock_lots"},
                ]
            });

            // 5. Valida si el producto existe
            if (!product) {
                return {
                    status: 404,
                    message: "Product not found",
                    data: null,
                };
            }
            const simpleProduct = product.toJSON() as ProductInterface & { stock_generals: StockGeneralInterface[] } & { stock_lots: StockLotInterface[] };
            const precio_bs = simpleProduct.base_price * tasa;
            
            let total_stock = 0;

            if (!simpleProduct.perishable) {
    
                total_stock = simpleProduct.stock_generals.reduce((accumulator, stock) =>{
                    return accumulator + stock.amount;
                }, 0);
            } else {

                total_stock = simpleProduct.stock_lots.reduce((accumlator, stock) =>{
                    return accumlator + stock.amount;
                },0);
            }

            const productoWithBsAndTotal = {
                ...product,
                precio_bs: parseFloat(precio_bs.toFixed(2)),
                total_stock: total_stock,
            };

            return {
                status: 200,
                message: "Product obtained correctly",
                data: productoWithBsAndTotal,
            };

        } catch (error) {
            console.error("Error fetching product: ", error);
            const message = (error instanceof Error) ? error.message : "Internal server error";
            return {
                status: 500,
                message, 
                data: null, 
            };
        }
    }

    /**
     * Crea un nuevo producto.
     * El frontend DEBE enviar 'base_price' en USD.
     */
    async create(product: ProductInterface) {
       try {
            const { createdAt, updatedAt, ...productData  } = product;
            
            // Lógica de negocio (ej: validar que base_price > 0)
            if (productData.base_price <= 0) {
                return {
                    status: 400, // Bad Request
                    message: "Base price must be greater than 0",
                    data: null
                };
            }
            
            const newProduct = await ProductDB.create(productData);

            return {
                status: 201, // Created
                message: "Product created successfully",
                data: newProduct,
            };
           } catch (error) { 
            console.error("Error creating product: ", error);
            const message = (error instanceof Error) ? error.message : "Internal server error";
            return {
                status: 500,
                message,
                data: null,
            };
        }
    }
    
    /**
     * Actualiza un producto.
     * El frontend DEBE enviar 'base_price' en USD.
     */
    async update(product_id: number, product: Partial<ProductInterface>) {
       try {
            const { createdAt, updatedAt, product_id: _, ... productData} = product;

            // Lógica de negocio (ej: validar si se está actualizando el precio)
            if (productData.base_price !== undefined && productData.base_price <= 0) {
                 return {
                    status: 400, // Bad Request
                    message: "Base price must be greater than 0",
                    data: null
                };
            }

            const [affectedRows] = await ProductDB.update(productData, { where: { product_id } });

            if (affectedRows === 0) {
                return {
                    status: 404,
                    message: "Product not found or no changes made",
                    data: null
                };
            }

            const updatedProduct = await ProductDB.findByPk(product_id);

            return {
                status: 200, // OK
                message: "Product updated correctly",
                data: updatedProduct,
            };
        } catch (error) {
            console.error("Error updating product: ", error);
            const message = (error instanceof Error) ? error.message : "Internal server error";
            return {
                status: 500,
                message,
                data: null,
            };
        }
    }
    
    /**
     * Elimina un producto por su ID.
     */
    async delete (product_id: number) {
       try {
            const affectedRows = await ProductDB.destroy({ where: {product_id} });

            if (affectedRows === 0) {
                 return {
                    status: 404,
                    message: "Product not found",
                    data: null
                };
            }

            return { 
                status: 200, // OK
                message: "Product deleted successfully",
                data: null
            };
        } catch (error) {
            console.error("Error deleting product: ", error);
            const message = (error instanceof Error) ? error.message : "Internal server error";
            return {
                status: 500,
                message,
                data: null,
            };
        }
    }
}


export const ProductServices = new ProductService();