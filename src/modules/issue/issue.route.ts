import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { issueController } from "./issue.controller";
import { Roles } from "../../types/types";

const router=Router()
//create issue only available to contributior and maintainer user role
router.post("/",authMiddleware(Roles.CONTRIBUTOR,Roles.MAINTAINER),issueController.createIssue)


//get all issue public access with query ? search filter func

router.get("/",issueController.getAllIssuesWithQuerySearch)

//single issue get api public route

router.get("/:id",issueController.getSingleIssue)


//update issue only maintainer and own contributor

router.put("/:id",authMiddleware(Roles.CONTRIBUTOR,Roles.MAINTAINER),issueController.updateIssue)

//delete api only maintainer

router.delete("/:id",authMiddleware(Roles.MAINTAINER),issueController.deleteIssue)
export const issueRoute=router