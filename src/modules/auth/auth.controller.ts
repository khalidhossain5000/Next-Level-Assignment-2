import type { Request, Response } from "express";
import { authServices } from "./auth.services";


const registerUser=async(req:Request,res:Response)=>{
    try {
        const result =await authServices.createUserInDb(req.body)
        delete result.rows[0].password
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result.rows[0]
        })
    } catch (error:any) {
        res.status(500).json({
            errors:error.message,
            message:"regisete rerror"
        })
        console.log(error,'error in sign up controller',error.code,error.message)
    }
}

//login user


const loginUser=async(req:Request,res:Response)=>{
    try {
        const result=await authServices.loginUserInDb(req.body)
       res.status(201).json({
        success:true,
        message:"Login Successfull",
        data:result
       })
    } catch (error) {
        console.log(error,'login error')
    }
}

export const authController={
    registerUser,
    loginUser
}