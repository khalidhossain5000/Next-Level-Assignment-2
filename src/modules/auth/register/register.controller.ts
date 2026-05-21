import type { Request, Response } from "express";
import { registerServices } from "./register.services";

const registerUser=async(req:Request,res:Response)=>{
    try {
        const result =await registerServices.createUserInDb(req.body)
        delete result.rows[0].password
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result.rows[0]
        })
    } catch (error) {
        console.log(error,'error in sign up controller')
    }
}


export const registerController={
    registerUser
}