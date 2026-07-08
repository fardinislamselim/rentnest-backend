import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { PropertyRoutes } from "../modules/property/property.route";
import { RentalRoutes } from "../modules/rental/rental.route";
import { UserRoutes } from "../modules/user/user.route";
import { paymentRoutes } from "../modules/payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/properties",
    route: PropertyRoutes,
  },
  {
    path: "/rentals",
    route: RentalRoutes,
  },
  {
    path: "/payments",
    route: paymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
