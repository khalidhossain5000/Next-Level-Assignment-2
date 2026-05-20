import bcrypt from "bcryptjs"
import { pool } from "../../database"
import type { IRegisterUser } from "./register.interface"

const createUserInDb=async(payload:IRegisterUser)=>{
    try {
        const{name,email,password,role}=payload
        const hashPassword=await bcrypt.hash(password,10)
        const result=await pool.query(`
            INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)
            RETURNING * 
        `,[name,email,hashPassword,role])
        return result
    } catch (error) {
        console.log(error,'error while createing user in db')
    }
}

export const registerServices={
    createUserInDb
}