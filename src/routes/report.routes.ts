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
    // http://localhost:3000/api/report/sales_dates_stats?filter=custom&customStart=2025-12-01&customEnd=2025-12-10

router.get("/top_selling_products",
    controller.getTopSellingProducts
);  // http://localhost:3000/api/report/top_selling_products?period=month
    // http://localhost:3000/api/report/top_selling_products?period=custom&customStart=2025-10-01&customEnd=2025-10-15

router.get("/inventory_efficiency",
    controller.getInventoryEfficiency
);  // http://localhost:3000/api/report/inventory_efficiency1
    // http://localhost:3000/api/report/inventory_efficiency?period=custom&customStart=2025-01-01&customEnd=2025-06-30

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
    // http://localhost:3000/api/report/employee_performance?period=custom&startDate=2025-12-01&endDate=2025-12-15

router.get("/client_correlation_fm",
    controller.getClientCorrelationFM
); // http://localhost:3000/api/report/client_correlation_fm?period=year

router.get("/cost_history/:product_id",
    controller.getProductCostHistory
); // http://localhost:3000/api/report/cost_history/15?provider_id=2

export const ReportRoute = router;

export default router;