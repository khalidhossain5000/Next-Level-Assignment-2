import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { issueController } from "./issue.controller";

const router=Router()
//create issue only available to contributior and maintainer user role
router.post("/",authMiddleware("contributor","maintainer"),issueController.createIssue)


//get all issue public access with query ? search filter func

router.get("/",issueController.getAllIssuesWithQuerySearch)

//single issue get api public route

router.get("/:id",issueController.getSingleIssue)


//update issue only maintainer and own contributor

router.put("/:id",authMiddleware("contributor","maintainer"),issueController.updateIssue)

//delete api only maintainer

router.delete("/:id",authMiddleware("maintainer"),issueController.deleteIssue)
export const issueRoute=router