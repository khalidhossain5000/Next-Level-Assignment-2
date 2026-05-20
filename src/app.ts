import express, { type Request, type Response } from "express"
const app=express()

app.use(express.json())

app.get("/",async(req:Request,res:Response)=>{
    res.send("Next level assignment backend server is running")
})

export default app