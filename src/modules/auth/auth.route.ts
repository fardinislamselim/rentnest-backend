import { Router } from "express";

import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { authController } from "./auth.controller";
import {
  changePasswordValidationSchema,
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

router.get("/me", auth(), authController.getMe);

router.post("/logout", authController.logoutUser);

router.patch(
  "/change-password",
  auth(),
  validate(changePasswordValidationSchema),
  authController.changePassword,
);

export const AuthRoutes = router;
