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

export const ReportRoute = router;

export default router;