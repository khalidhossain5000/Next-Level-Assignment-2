import type { Request, Response } from "express";
import { registerServices } from "./register.services";

const registerUser=async(req:Request,res:Response)=>{
    try {
        const result =await registerServices.createUserInDb(req.body)
    } catch (error) {
        console.log(error,'error in sign up controller')
    }
}


export const registerController={
    registerUser
}