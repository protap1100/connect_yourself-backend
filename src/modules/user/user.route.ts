import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utilties/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpsStatus from "http-status";


const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}


router.post("/register", userController.createUser);
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifyUser = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    if (typeof verifyUser === "string") {
      throw new Error("Invalid token");
    }
    const { email, name, id, role } = verifyUser;

    const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    if (!requiredRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: httpsStatus.FORBIDDEN,
        message: "You do not have permission to access this resource",
      });
    }
    req.user = { email, name, id, role };
    next();
  },

  userController.getMyProfile,
);

export const userRoutes = router;
