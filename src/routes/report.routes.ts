import { Router } from "express";
import { ReportController } from "../controllers";

const router = Router();
const controller = new ReportController();

// METHOD GET
router.get("/total_usd_sales",
    controller.totalUsdSales
); // http://localhost:3000/api/report/total_usd_sales

router.get("/total_usd_purchases",
    controller.totalUsdPurchases
); // http://localhost:3000/api/report/total_usd_purchases

router.get("/sales_dates_stats",
    controller.getSalesChart
);  // http://localhost:3000/api/report/sales_dates_stats?filter=week

router.get("/top_selling_products",
    controller.getTopSellingProducts
);  // http://localhost:3000/api/report/top_selling_products?period=month

router.get("/inventory_efficiency",
    controller.getInventoryEfficiency
);  // http://localhost:3000/api/report/inventory_efficiency1

router.get("/low_stock_alerts",
    controller.getLowStockAlerts
); // http://localhost:3000/api/report/low_stock_alerts

router.get("/inventory_value",
    controller.getInventoryValue
); // http://localhost:3000/api/report/inventory_value

router.get("/total_inventory_items",
    controller.getTotalInventoryItems
); // http://localhost:3000/api/report/total_inventory_items

router.get("/inventory_by_category",
    controller.getInventoryByCategory
); // http://localhost:3000/api/report/inventory_by_category

router.get("/employee_performance",
    controller.getEmployeePerformance
);  // http://localhost:3000/api/report/employee_performance?period=month

router.get("/client_correlation_fm",
    controller.getClientCorrelationFM
);  // Uso estándar:

router.get("/cost_history/:product_id",
    controller.getProductCostHistory
); // http://localhost:3000/api/report/cost_history/15?provider_id=2


router.get("/sales_report_range",
    controller.getAllSalesByRange
);

// Ruta para reporte de Compras
router.get("/purchases_report_range",
    controller.getAllPurchasesByRange
);

router.get("/provider_analysis", controller.getSupplierAnalysis);

/* Ejemplo de uso:
 GET http://localhost:3000/api/report/provider_analysis?period=year
*/

export const ReportRoute = router;

export default router;