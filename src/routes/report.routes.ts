import { Router } from "express";
import { ReportController } from "../controllers";

const router = Router();
const controller = new ReportController();

// METHOD GET
router.get("/total_usd_sales", 
    controller.totalUsdSales
); // http://localhost:3000/api/report/total_usd_sales

export const ReportRoute = router;

export default router;