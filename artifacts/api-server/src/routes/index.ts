import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import healthRouter from "./health";
import { requireAdmin } from "../middlewares/adminMiddleware";
import lobbyRouter from "./lobby";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lobbyRouter);
router.use("/admin", requireAdmin);
router.use(adminRouter);

export default router;
