import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { tenantController } from "./tenant.controller";

const router = Router();

router.get("/dashboard", auth(Role.TENANT), tenantController.getDashboard);

export const TenantRoutes = router;
