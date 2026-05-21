import { Router } from "express";
import { loginController } from "./login.controller";

const router=Router()

//login user route
router.post("/",loginController.loginUser)
export const loginRoute=router