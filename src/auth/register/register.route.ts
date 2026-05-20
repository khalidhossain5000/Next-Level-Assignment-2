import { Router } from "express";
import { registerController } from "./register.controller";

const router=Router()
//sign up user
router.post("/",registerController.registerUser)
export const registerRoute=router