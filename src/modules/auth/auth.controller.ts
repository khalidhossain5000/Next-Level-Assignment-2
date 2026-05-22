import type { Request, Response } from "express";
import { authServices } from "./auth.services";
import sendResponse from "../../utilis/sendResponse";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUserInDb(req.body);
    delete result.rows[0].password;
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong!!!!!",
      error: error.message,
    });
  }
};

//login user

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUserInDb(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong!!!!!",
      error: error.message,
    });
  }
};

export const authController = {
  registerUser,
  loginUser,
};
