
import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/errors";
import { errorResponse } from "../models/responseModel";

export interface AuthorizationOptions {
  hasRole?: string[];
  allowSameUser?: boolean;
}

/**
 * Middleware to check if a user is authorized based on their role or UID.
 * Now integrated with centralized error handling system.
 *
 * This middleware:
 * - Checks if the user has required roles
 * - Optionally allows users to access their own resources
 * - Throws standardized AuthorizationError for access denied scenarios
 *
 
 */

export const authorize = (opts: AuthorizationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { role, uid } = res.locals;
      const targetId = req.params.uid || req.params.id; 

      
      if (opts.allowSameUser && uid && uid === targetId) {
        return next();
      }

      
      if (!role) {
        throw new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND");
      }

      
      if (opts.hasRole && !opts.hasRole.includes(role)) {
        throw new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE");
      }

      
      next();
    } catch (error) {
      console.error("Authorization Error:", (error as Error).message);
      res.status(403).json(
        errorResponse("Forbidden: Access denied", "FORBIDDEN_ACCESS")
      );
    }
  };
};
