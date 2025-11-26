// src/data/seeders/product.seed.ts
import { ProductDB } from "src/models";

export const productSeed = async () => {
    try {
        console.log("Iniciando seed de Productos...");

        const productsToCreate = [
            // --- Categoria 1: Alimentos Básicos ---
            {
                name: "Harina de Maíz Blanco P.A.N. (1kg)",
                sku: "ALI-001",
                description: "Harina de maíz blanco precocida, libre de gluten. Producto esencial para la elaboración de arepas, empanadas y hallacas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/harina_pan_ibklkc.png",
                category_id: 1, 
                base_price: 1.45,
                min_stock: 5,
                perishable: true,
                status: true,
            },
            {
                name: "Arroz Blanco de Mesa Primor (1kg)",
                sku: "ALI-002",
                description: "Arroz blanco tipo I, granos enteros y seleccionados. Enriquecido con vitaminas. Ideal para acompañar comidas diarias.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/arroz_koospm.jpg",
                category_id: 1,
                base_price: 2.05,
                min_stock: 5,
                perishable: true,
                status: true,
            },
            {
                name: "Margarina Mavesa (500g)",
                sku: "ALI-003",
                description: "Margarina con sal, rica en vitaminas A y D. Envase plástico redondo. Clásica para untar o cocinar.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/mantequilla_vgngsw.png",
                category_id: 1, 
                base_price: 3.10,
                min_stock: 5,
                perishable: true,
                status: true,
            },
            {
                name: "Pasta Spaghetti Mary (1kg)",
                sku: "ALI-004",
                description: "Pasta larga tipo spaghetti hecha de sémola de trigo durum. Tiempo de cocción aproximado 8-10 minutos.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/pasta_qjhbff.jpg",
                category_id: 1, 
                base_price: 2.50,
                min_stock: 5,
                perishable: true,
                status: true,
            },
            {
                name: "Aceite de Maíz Mazeite (1L)",
                sku: "ALI-005",
                description: "Aceite 100% de maíz, sin colesterol. Ideal para freír y aderezar ensaladas. Botella plástica transparente.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/aceite_vmozl9.jpg",
                category_id: 1, 
                base_price: 4.50,
                min_stock: 5,
                perishable: true,
                status: true,
            },
            {
                name: "Marcos Castellanos",
                sku: "ALI-006",
                description: "Un Marcos Castellanos delicioso y listo para consumir.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764117893/Screenshot_2025-11-25_204434_btgwdn.png",
                category_id: 1, 
                base_price: 99999.99,
                min_stock: 1,
                perishable: true,
                status: true,
            },

            // --- Categoria 2: Higiene Personal Básico ---
            {
                name: "Jabón de Tocador Protex Avena (110g)",
                sku: "HIG-001",
                description: "Jabón en barra antibacterial con extracto de avena. Elimina el 99.9% de las bacterias y cuida la piel.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/jabon_ba%C3%B1o_b3ahfc.jpg",
                category_id: 2, 
                base_price: 2.50,
                min_stock: 5,
                perishable: false,
                status: true,
            },
            {
                name: "Crema Dental Colgate Triple Acción (100ml)",
                sku: "HIG-002",
                description: "Pasta de dientes con flúor. Ofrece protección contra caries, blancura y aliento fresco (menta original).",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/crema_dental_lkqwgv.jpg",
                category_id: 2, 
                base_price: 3.50,
                min_stock: 10,
                perishable: true,
                status: true,
            },
            {
                name: "Champú Head & Shoulders Limpieza Renovadora (375ml)",
                sku: "HIG-003",
                description: "Champú control caspa, fórmula clásica para todo tipo de cabello. Limpieza profunda y alivio de la picazón.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/shampoo_ajo7rx.jpg",
                category_id: 2, 
                base_price: 10.00,
                min_stock: 10,
                perishable: false,
                status: true,
            },
            { 
                name: "Desodorante Rexona Bamboo (Barra 50g)",
                sku: "HIG-004",
                description: "Desodorante antitranspirante en barra para mujer/hombre, protección 48 horas. Aroma fresco a bambú.", 
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/desodorante_barra_fhaiqf.jpg",
                category_id: 2, 
                base_price: 6.00,
                min_stock: 15,
                perishable: true,
                status: true,
            },
            {
                name: "Papel Higiénico Rosal Plus (4 Rollos)",
                sku: "HIG-005",
                description: "Papel higiénico hoja doble, textura suave y resistente. Paquete de 4 rollos.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/papel_higienico_tnklcq.png",
                category_id: 2, 
                base_price: 4.25,
                min_stock: 20,
                perishable: false,
                status: true,
            },

            // --- Categoria 3: Limpieza Básica ---
            {
                name: "Lavaplatos en Crema Las Llaves (225g)",
                sku: "LIM-001",
                description: "Jabón en crema con aroma a limón, arranca grasa efectivo para vajillas y ollas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/lava_platos_sn0t9a.jpg",
                category_id: 3, 
                base_price: 1.65,
                min_stock: 10,
                perishable: false,
                status: true,
            },
            {
                name: "Cloro Nevex Regular (1 Litro)",
                sku: "LIM-002",
                description: "Blanqueador y desinfectante líquido a base de cloro. Ideal para ropa blanca y limpieza de pisos.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115508/cloro_tyyajs.jpg",
                category_id: 3, 
                base_price: 3.00,
                min_stock: 10,
                perishable: false,
                status: true,
            },
            {
                name: "Detergente en Polvo Ace (900g)",
                sku: "LIM-003",
                description: "Detergente multiusos para lavar ropa, con limpieza profunda y blancura. Bolsa de 900g.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/detergente_polvo_fpnp4t.jpg",
                category_id: 3, 
                base_price: 10.50,
                min_stock: 8,
                perishable: false,
                status: true,
            },
            {
                name: "Desinfectante Mistolin Lavanda (828ml)",
                sku: "LIM-004",
                description: "Limpiador líquido fragante para pisos y superficies. Aroma duradero a lavanda.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115494/desinfectante_vd3xpo.png",
                category_id: 3, 
                base_price: 4.75,
                min_stock: 10,
                perishable: false,
                status: true,
            },
            {
                name: "Esponja Doble Uso Scotch-Brite (Pqte 1 un.)",
                sku: "LIM-005",
                description: "Esponja con fibra verde abrasiva para ollas y lado amarillo suave para vajillas delicadas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/esponja_yygcfi.jpg",
                category_id: 3, 
                base_price: 3.50,
                min_stock: 15,
                perishable: false,
                status: true,
            },

            // --- Categoria 4: Herramientas Básicas ---
            {
                name: "Destornillador Estriado Pretul 1/4\" x 4\"",
                sku: "HER-001",
                description: "Destornillador con punta de estrella (Phillips), mango de acetato para fácil agarre. Uso doméstico.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/destornillador_bxszai.png",
                category_id: 4, 
                base_price: 10.25,
                min_stock: 5,
                perishable: false,
                status: true,
            },
            {
                name: "Martillo de Uña Curva 16oz (Mango Madera)",
                sku: "HER-002",
                description: "Martillo clásico de acero para clavar y sacar clavos. Mango de madera resistente.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/martillo_dqkbne.png",
                category_id: 4, 
                base_price: 46.00,
                min_stock: 3,
                perishable: false,
                status: true,
            },
            {
                name: "Cinta Métrica 5 Metros (Truper/Stanley)",
                sku: "HER-003",
                description: "Flexómetro con cinta de acero, freno de seguridad y clip para cinturón. Escala en centímetros y pulgadas.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115508/cinta_metrica_o65nfl.png",
                category_id: 4, 
                base_price: 19.00,
                min_stock: 5,
                perishable: false,
                status: true,
            },
            {
                name: "Alicate Universal 8 TOTAL\" (Mango de Goma)",
                sku: "HER-004",
                description: "Alicate Mecánico industrial para cortar, doblar y sujetar cables. Mango aislado antideslizante.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/alicate_mdbwkw.png",
                category_id: 4, 
                base_price: 7.00,
                min_stock: 5,
                perishable: false,
                status: true,
            },
            {
                name: "Llave Ajustable (Inglesa) 8 Pulgadas",
                sku: "HER-005",
                description: "Llave de acero cromado con apertura ajustable para tuercas de diferentes tamaños.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/llave_ajustable_bvdxam.png",
                category_id: 4, 
                base_price: 13.50,
                min_stock: 3,
                perishable: false,
                status: true,
            },

            // --- Categoria 5: Ferretería Básica (Insumos) ---
            {
                name: "Bombillo LED 9W Luz Blanca (Rosca E27)",
                sku: "FER-001",
                description: "Bombillo ahorrador tecnología LED, rosca estándar doméstica. Equivalente a 60W incandescente.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/bombillo_urg5mf.png",
                category_id: 5, 
                base_price: 3.25,
                min_stock: 20,
                perishable: false,
                status: true,
            },
            {
                name: "Teipe Cobra Negro (Cinta Eléctrica) 18m",
                sku: "FER-002",
                description: "Cinta aislante de PVC para empalmes eléctricos y reparaciones menores. Resistente al calor y humedad.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/teipe_negro_ogj5kh.png",
                category_id: 5, 
                base_price: 4.75,
                min_stock: 15,
                perishable: false,
                status: true,
            },
            {
                name: "Candado de Hierro 30mm (Cisa)",
                sku: "FER-003",
                description: "Candado de seguridad estándar con cuerpo de Latón de colo dorado y arco de Latón. Incluye 2 llaves.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115508/candado_egro0r.png",
                category_id: 5, 
                base_price: 12.75,
                min_stock: 5,
                perishable: false,
                status: true,
            },
            {
                name: "Tirro Plástico Transparente (Cinta de Embalaje)",
                sku: "FER-004",
                description: "Cinta adhesiva ancha transparente para sellar cajas de cartón y empaques.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115507/cinta_adehesiva_dfn8zs.jpg",
                category_id: 5, 
                base_price: 2.75,
                min_stock: 10,
                perishable: false,
                status: true,
            },
            {
                name: "Pintura En Spray / Aerosol Colores Estándar 400ml Zasc",
                sku: "FER-005",
                description: "Pintura en aerosol ZASC de 400 ml. De secado rápido, alta cobertura y acabado brillante, para usar en múltiples superficies.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/pintura_spray_yuroky.png",
                category_id: 5, 
                base_price: 5.50,
                min_stock: 10,
                perishable: false,
                status: true,
            },

            // --- Categoria 6: Muebles Básicos ---
            {
                name: "Silla Plástica Manaplas (Sin brazos)",
                sku: "MUE-001",
                description: "Silla monobloque apilable, ligera y resistente. Ideal para cocina, jardín o eventos. Color blanco.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/silla_plastica_da6nqi.png",
                category_id: 6, 
                base_price: 21.50,
                min_stock: 4,
                perishable: false,
                status: true,
            },
            {
                name: "Estante Plástico 4 Niveles",
                sku: "MUE-002",
                description: "Organizador de plástico resistente tipo esqueleto, fácil de armar sin herramientas. Color negro.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115495/estante_plastico_say28x.jpg",
                category_id: 6, 
                base_price: 50.00,
                min_stock: 2,
                perishable: false,
                status: true,
            },
            {
                name: "Mesa Plegable Tipo Maletín (1.80m)",
                sku: "MUE-003",
                description: "Mesa auxiliar con superficie de plástico duro y patas de metal plegables. Se cierra como un maletín.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115496/mesa_desplegable_cl69ga.png",
                category_id: 6, 
                base_price: 200.00,
                min_stock: 1,
                perishable: false,
                status: true,
            },
            {
                name: "Banqueta / Escalera de Aluminio Aladino (2 Pasos)",
                sku: "MUE-004",
                description: "Taburete pequeño con escalones antideslizantes. Plegable y fácil de guardar. Uso doméstico.",
                image_url: "https://res.cloudinary.com/dbfztnfc8/image/upload/v1764115497/banqueta_iavftb.png",
                category_id: 6, 
                base_price: 40.00,
                min_stock: 2,
                perishable: false,
                status: true,
            },
        ];

        // 1. Obtener los nombres de los productos ya existentes
        const existingProducts = await ProductDB.findAll({ attributes: ['name'] }); 
        const existingNames = existingProducts.map(product => (product as any).name);

        // 2. Filtrar productos que no existan
        const uniqueProductsToCreate = productsToCreate.filter(product => 
            !existingNames.includes(product.name)
        );

        // 3. Aplicar fechas
        const finalProducts = uniqueProductsToCreate.map(product => ({
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalProducts.length > 0) {
            // 4. Insertar
            const createdProducts = await ProductDB.bulkCreate(finalProducts);
            console.log(`Seed de Productos ejecutado correctamente. Insertados: ${createdProducts.length}`);
        } else {
            console.log("Seed de Productos ejecutado. No se insertaron nuevos productos (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Productos:", error);
        throw error;
    }
};