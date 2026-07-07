import { Router } from "express";

import { authController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerValidationSchema),
  authController.registerUser,
);

router.post(
  "/login",
  validate(loginValidationSchema),
  authController.loginUser,
);

router.post("/refresh-token", authController.refreshToken);

export const AuthRoutes = router;
