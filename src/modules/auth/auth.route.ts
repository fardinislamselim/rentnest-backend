import { Router } from "express";

import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { registerValidationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerValidationSchema),
  AuthController.registerUser,
);

export const AuthRoutes = router;
