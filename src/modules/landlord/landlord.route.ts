import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { landlordController } from "./landlord.controller";

const router = Router();

router.get("/dashboard", auth(Role.LANDLORD), landlordController.getDashboard);

export const LandlordRoutes = router;
