import { Router } from "express";

import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { userController } from "./user.controller";
import {
  updateProfilePictureValidationSchema,
  updateProfileValidationSchema,
} from "./user.validation";

const router = Router();

router.get("/me", auth(), userController.getOwnProfile);

router.patch(
  "/profile",
  auth(),
  validate(updateProfileValidationSchema),
  userController.updateProfile,
);

router.patch(
  "/profile/picture",
  auth(),
  validate(updateProfilePictureValidationSchema),
  userController.updateProfilePicture,
);

export const UserRoutes = router;
