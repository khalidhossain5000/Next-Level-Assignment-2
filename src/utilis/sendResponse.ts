import type { Response } from "express";
import type { TResponseGlobal } from "../types/types";

const sendResponse = <T>(res: Response, data: TResponseGlobal<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.error,
  });
};

export default sendResponse;