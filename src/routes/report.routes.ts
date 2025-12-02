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
); // http://localhost:3000/api/report/sales_dates_stats?filter=week

router.get("/top_selling_products",
    controller.getTopSellingProducts
); // http://localhost:3000/api/report/top_selling_products?period=month

router.get("/inventory_efficiency",
    controller.getInventoryEfficiency
); // http://localhost:3000/api/report/inventory_efficiency

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

export const ReportRoute = router;

export default router;