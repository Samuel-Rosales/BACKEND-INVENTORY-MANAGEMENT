import { ProductDB } from "src/models";

export const productSeed = async () => {
    try {
        console.log("🍬 Iniciando seed de Productos (Bodega)...");

        const productsToCreate = [
            // --- Categoria 1: Alimentos Básicos (Víveres) ---
            {
                name: "Harina de Maíz Blanco P.A.N. (1kg)",
                sku: "VIV-001",
                description: "Harina de maíz precocida. Indispensable para las arepas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/harina_pan_ibklkc.png",
                category_id: 1, base_price: 1.45, min_stock: 20, perishable: true, status: true,
            },
            {
                name: "Arroz Blanco de Mesa Primor (1kg)",
                sku: "VIV-002",
                description: "Arroz blanco tipo I, granos enteros.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/arroz_koospm.jpg",
                category_id: 1, base_price: 2.05, min_stock: 15, perishable: true, status: true,
            },
            {
                name: "Pasta Spaghetti Mary (1kg)",
                sku: "VIV-003",
                description: "Pasta larga de sémola de trigo durum.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/pasta_qjhbff.jpg",
                category_id: 1, base_price: 2.50, min_stock: 15, perishable: true, status: true,
            },
            {
                name: "Margarina Mavesa (500g)",
                sku: "VIV-004",
                description: "Margarina con sal, el sabor de siempre.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/mantequilla_vgngsw.png",
                category_id: 1, base_price: 3.10, min_stock: 10, perishable: true, status: true,
            },
            {
                name: "Aceite de Maíz Mazeite (1L)",
                sku: "VIV-005",
                description: "Aceite 100% puro de maíz.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/aceite_vmozl9.jpg",
                category_id: 1, base_price: 4.50, min_stock: 10, perishable: true, status: true,
            },
            {
                name: "Azúcar Refinada Montalbán (1kg)",
                sku: "VIV-006",
                description: "Azúcar blanca refinada de alta pureza.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812769/azucar_rjfcsk.png", // Placeholder URL
                category_id: 1, base_price: 1.80, min_stock: 20, perishable: true, status: true,
            },
            {
                name: "Salsa de Tomate Pampero (397g)",
                sku: "VIV-007",
                description: "Ketchup clásico para acompañar comidas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812768/salsa_tomate_wdprvg.jpg", // Placeholder URL
                category_id: 1, base_price: 2.20, min_stock: 10, perishable: true, status: true,
            },
            // El Producto Especial (No se toca)
            {
                name: "Marcos Castellanos",
                sku: "ESP-001",
                description: "Edición Limitada. Invaluable.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764117893/Screenshot_2025-11-25_204434_btgwdn.png",
                category_id: 1, base_price: 99999.99, min_stock: 1, perishable: true, status: true,
            },

            // --- Categoria 2: Higiene Personal (Esenciales) ---
            {
                name: "Jabón de Tocador Protex Avena (110g)",
                sku: "HIG-001",
                description: "Protección antibacterial para la piel.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/jabon_ba%C3%B1o_b3ahfc.jpg",
                category_id: 2, base_price: 1.50, min_stock: 12, perishable: false, status: true,
            },
            {
                name: "Crema Dental Colgate Triple Acción (100ml)",
                sku: "HIG-002",
                description: "Protección anticaries y blancura.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/crema_dental_lkqwgv.jpg",
                category_id: 2, base_price: 2.80, min_stock: 10, perishable: true, status: true,
            },
            {
                name: "Papel Higiénico Rosal Plus (4 Rollos)",
                sku: "HIG-003",
                description: "Suavidad y rendimiento.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/papel_higienico_tnklcq.png",
                category_id: 2, base_price: 3.50, min_stock: 20, perishable: false, status: true,
            },
            {
                name: "Champú Head & Shoulders (375ml)",
                sku: "HIG-004",
                description: "Limpieza renovadora control caspa.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/shampoo_ajo7rx.jpg",
                category_id: 2, base_price: 8.50, min_stock: 5, perishable: false, status: true,
            },

            // --- Categoria 3: Limpieza del Hogar ---
            {
                name: "Lavaplatos en Crema Las Llaves (225g)",
                sku: "LIM-001",
                description: "Arranca la grasa difícil.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/lava_platos_sn0t9a.jpg",
                category_id: 3, base_price: 1.65, min_stock: 10, perishable: false, status: true,
            },
            {
                name: "Cloro Nevex Regular (1 Litro)",
                sku: "LIM-002",
                description: "Blanqueador para ropa y superficies.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115508/cloro_tyyajs.jpg",
                category_id: 3, base_price: 2.50, min_stock: 10, perishable: false, status: true,
            },
            {
                name: "Detergente Ace en Polvo (900g)",
                sku: "LIM-003",
                description: "Blancura increíble.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/detergente_polvo_fpnp4t.jpg",
                category_id: 3, base_price: 5.50, min_stock: 15, perishable: false, status: true,
            },

            // --- Categoria 4: Golosinas y Snacks (NUEVO - Bodega Vibe) ---
            {
                name: "Galletas María Puig (Paquete Tubo)",
                sku: "SNK-001",
                description: "La galleta clásica para la merienda.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812768/galleta_maria_agt6kv.jpg",
                category_id: 4, base_price: 1.20, min_stock: 25, perishable: true, status: true,
            },
            {
                name: "Pepito Cheese (Bolsa Grande)",
                sku: "SNK-002",
                description: "Snack de maíz con sabor a queso.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812768/pepito_h8lc5u.jpg",
                category_id: 4, base_price: 2.50, min_stock: 15, perishable: true, status: true,
            },
            {
                name: "Chocolate Savoy de Leche (130g)",
                sku: "SNK-003",
                description: "Chocolate con leche venezolano. Sabor criollo.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812769/savoy_chocolate_wrhbpd.png",
                category_id: 4, base_price: 3.00, min_stock: 20, perishable: true, status: true,
            },
            {
                name: "Chupeta Bon Bon Bum (Unidad)",
                sku: "SNK-004",
                description: "Chupeta rellena de chicle, sabores surtidos.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812769/chupetas_ebqhbz.jpg",
                category_id: 4, base_price: 0.25, min_stock: 100, perishable: true, status: true,
            },
            {
                name: "Galleta Susy (Paquete Individual)",
                sku: "SNK-005",
                description: "Galleta rellena de crema sabor a chocolate.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812769/susy_dxjtb2.png",
                category_id: 4, base_price: 0.80, min_stock: 40, perishable: true, status: true,
            },

            // --- Categoria 5: Bebidas y Refrescos (NUEVO) ---
            {
                name: "Refresco Coca-Cola (1.5 Litros)",
                sku: "BEB-001",
                description: "Bebida gaseosa sabor original.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812769/cocacola_otjs8n.jpg",
                category_id: 5, base_price: 2.00, min_stock: 24, perishable: true, status: true,
            },
            {
                name: "Malta Polar (Botella 250ml)",
                sku: "BEB-002",
                description: "Bebida de malta carbonatada, nutritiva y refrescante.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812768/malta_bebida_dltexb.jpg",
                category_id: 5, base_price: 0.90, min_stock: 36, perishable: true, status: true,
            },
            {
                name: "Agua Mineral Minalba (1.5 Litros)",
                sku: "BEB-003",
                description: "Agua pura de manantial.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764812768/agua_mineral_hnu3kv.jpg",
                category_id: 5, base_price: 1.10, min_stock: 24, perishable: true, status: true,
            },
        ];

        // Lógica de inserción (igual a la anterior, verifica duplicados por nombre)
        const existingProducts = await ProductDB.findAll({ attributes: ['name'] }); 
        const existingNames = new Set(existingProducts.map(p => (p as any).name));

        const finalProducts = productsToCreate
            .filter(p => !existingNames.has(p.name))
            .map(p => ({ ...p, createdAt: new Date(), updatedAt: new Date() }));

        if (finalProducts.length > 0) {
            const created = await ProductDB.bulkCreate(finalProducts);
            console.log(`✅ ${created.length} productos de bodega insertados.`);
        } else {
            console.log("ℹ️ No hay productos nuevos (ya existían).");
        }

    } catch (error) {
        console.error("❌ Error seed Productos:", error);
        throw error;
    }
};