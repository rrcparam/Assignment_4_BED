// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";


const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token: string | undefined = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    if (!token) {
      throw new AuthenticationError(
        "Unauthorized: No token provided",
        "TOKEN_NOT_FOUND"
      );
    }

    
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

    
    _res.locals.uid = decodedToken.uid;
    _res.locals.email = decodedToken.email;
    _res.locals.role = decodedToken.role || "user";

    next();
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
     
      return next(error);
    }

    if (error instanceof Error) {
      return next(
        new AuthenticationError(
          `Unauthorized: ${getErrorMessage(error)}`,
          getErrorCode(error)
        )
      );
    }

    return next(
      new AuthenticationError("Unauthorized: Invalid token", "TOKEN_INVALID")
    );
  }
};

export default authenticate;
