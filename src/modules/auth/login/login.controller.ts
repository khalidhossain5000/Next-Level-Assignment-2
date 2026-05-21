import type { Request, Response } from "express";
import { loginServices } from "./login.services";

const loginUser=async(req:Request,res:Response)=>{
    try {
        const result=await loginServices.loginUserInDb(req.body)
       res.status(201).json({
        success:true,
        message:"Login Successfull",
        data:result
       })
    } catch (error) {
        console.log(error,'login error')
    }
}


export const loginController={
    loginUser
}