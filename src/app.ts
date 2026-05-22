import express, { type Request, type Response } from "express"
import { issueRoute } from "./modules/issue/issue.route"
import globalErrorHandler from "./utilis/globalErrorHandler"
import { authRoute } from "./modules/auth/auth.route"

const app=express()

app.use(express.json())

app.get("/",async(req:Request,res:Response)=>{
    res.send("Next level assignment backend server is running")
})

//auth realted setup

app.use("/api/auth",authRoute)

//issue realted api

app.use("/api/issues",issueRoute)

//global error
app.use(globalErrorHandler)
export default app