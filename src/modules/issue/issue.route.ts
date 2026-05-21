import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { issueController } from "./issue.controller";

const router=Router()
//create issue only available to contributior and maintainer user role
router.post("/",authMiddleware("contributor","maintainer"),issueController.createIssue)
export const issueRoute=router