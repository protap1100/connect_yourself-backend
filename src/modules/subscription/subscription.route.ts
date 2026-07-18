import { Router } from "express";
import { subscriptionController } from "./subscription.interface";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.createCheckoutSession,
);

export const SubscriptionRoutes = router;
