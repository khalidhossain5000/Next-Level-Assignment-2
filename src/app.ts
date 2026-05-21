import express, { type Request, type Response } from "express"
import { registerRoute } from "./modules/auth/register/register.route"
import { loginRoute } from "./modules/auth/login/login.route"
import { issueRoute } from "./modules/issue/issue.route"
import globalErrorHandler from "./utilis/globalErrorHandler"

const app=express()

app.use(express.json())

app.get("/",async(req:Request,res:Response)=>{
    res.send("Next level assignment backend server is running")
})

//sign up realed api here

app.use("/api/auth/signup",registerRoute)

//login realted api here
app.use("/api/auth/login",loginRoute)


//issue realted api

app.use("/api/issues",issueRoute)

//global error
app.use(globalErrorHandler)
export default app