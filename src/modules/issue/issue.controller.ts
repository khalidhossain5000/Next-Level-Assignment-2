import type { Request, Response } from "express";
import { issueServices } from "./issue.services";
import type { JwtPayload } from "jsonwebtoken";

const createIssue=async(req:Request,res:Response)=>{
    try {
        const {id}=req.user as JwtPayload
        const result=await issueServices.createIssuesInDb(req.body,id)

        res.status(201).json({
            success:true,
            message:"Issues created",
            data:result.rows[0]
        })
    } catch (error) {
        console.log(error,'this is error controler issues')
    }
}


//get all issue with query search functionality

const getAllIssuesWithQuerySearch=async(req:Request,res:Response)=>{

    try {
        const result=await issueServices.getIssuesFromDbWithQuery(req.query)
     console.log('result in issue get controoler',result)
    } catch (error) {
        console.log(error,'error in get issues')
    }
}
















export const issueController={
    createIssue,
    getAllIssuesWithQuerySearch
}