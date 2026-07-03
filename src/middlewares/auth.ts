import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilties/catchAsync";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utilties/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

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

// auth(Role.ADMIN, Role.USER, Role.AUTHOR) is a middleware function that checks if the user has the required role to access the route. If the user does not have the required role, it will return a 403 Forbidden response.
export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }

    const verifyUser = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (verifyUser.success === false) {
      throw new Error(verifyUser.message || "Invalid token");
    }

    const { email, name, id, role } = verifyUser.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden: You do not have permission to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support.");
    }
    req.user = { email, name, id, role };
    next();
  });
};
