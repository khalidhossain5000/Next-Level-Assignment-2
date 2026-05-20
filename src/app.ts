import express, { type Request, type Response } from "express"
import { registerRoute } from "./auth/register/register.route"
const app=express()

app.use(express.json())

app.get("/",async(req:Request,res:Response)=>{
    res.send("Next level assignment backend server is running")
})

//sign up realed api here

app.use("/api/auth/signup",registerRoute)

export default app