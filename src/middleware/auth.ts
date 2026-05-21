import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import configuration from "../config/config";
import { pool } from "../database";
const authMiddleware = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorised access",
        });
        return;
      }
      //we got token now need to decode the payload and token here

      const decoded = jwt.verify(
        token as string,
        configuration.jwtAccessTokenSecret as string,
      ) as JwtPayload;

      //now we got data need to check if user is exist on db or not
      const userExist = await pool.query(
        `
        SELECT * FROM users WHERE id=$1
        `,
        [decoded.id],
      );

      if (userExist.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "user not found",
        });
        return;
      }
      //now check role and add role base protection
      if (roles.length && !roles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden access ! Invalid user role",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log(error, "error in auth middleware");
      next(error);
    }
  };
};

export default authMiddleware;
