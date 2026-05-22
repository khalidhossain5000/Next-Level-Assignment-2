import type { Request, Response } from "express";
import { issueServices } from "./issue.services";
import type { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utilis/sendResponse";
import issueFilterValidation from "../../utilis/issueFilterValidation";


const createIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as JwtPayload;
    const result = await issueServices.createIssuesInDb(req.body, id);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//get all issue with query search functionality

const getAllIssuesWithQuerySearch = async (req: Request, res: Response) => {
  try {
    //query validation
    issueFilterValidation(res,req.query)
    //get all data result from services
    const result = await issueServices.getIssuesFromDbWithQuery(req.query);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue Retrived Successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueServices.getSingleIssue(id as string);
      return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue Retrived Successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//update issue maintainer can update and contributor can update if that is his own issue

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueServices.updateIssueInDb(
      id as string,
      req.user as JwtPayload,
      req.body,
    );
      return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
   
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//delete issues only maintainer

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueServices.deleteIssueFromDb(id as string);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssuesWithQuerySearch,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
