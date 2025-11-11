import { Request, Response } from "express";
import { auth } from "../../../config/firebaseConfig";
import { successResponse, errorResponse } from "../src/../models/responseModel";

// to Fetch user details
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRecord = await auth.getUser(req.params.uid);
    res.status(200).json(successResponse(userRecord, "USER_FETCH_SUCCESS"));
  } catch (err) {
    res.status(500).json(errorResponse("Failed to fetch user details", "USER_FETCH_ERROR"));
  }
};

//  Assigning a custom role to a user

export const setUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, role } = req.body;
    await auth.setCustomUserClaims(uid, { role });
    res.status(200).json(successResponse({ uid, role }, "ROLE_SET_SUCCESS"));
  } catch (err) {
    res.status(500).json(errorResponse("Failed to set user role", "ROLE_SET_ERROR"));
  }
};
