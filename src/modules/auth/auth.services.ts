import bcrypt from "bcryptjs";
import { pool } from "../../database";
import type { ILoginUser, IRegisterUser } from "./auth.interface";
import configuration from "../../config/config";
import jwt from "jsonwebtoken"

const createUserInDb = async (payload: IRegisterUser) => {
  const { name, email, password, role = "contributor" } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
            INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)
            RETURNING * 
        `,
    [name, email, hashPassword, role],
  );
  return result;
};

//login user


const loginUserInDb=async(payload:ILoginUser)=>{
    const {email,password}=payload
    const result=await pool.query(`
        SELECT * FROM users WHERE email=$1
    `,[email])
    //checking if user is exist on db
    if(result.rows.length===0){
        throw new Error("User not found")
    }
    const user=result.rows[0]
    //now user is exist but is the password is correct lets check
    const isValidPassword=await bcrypt.compare(password,user.password)
    if(!isValidPassword){
        throw new Error("Invalid login credentials! Check email or password and try again")
    }
    //now here password and user both are valid now lets generate token
    const jwtPayload={
        id:user.id,
        name:user.name,
        role:user.role
    }
    const token=jwt.sign(jwtPayload,configuration.jwtAccessTokenSecret as string,{
        expiresIn:"2d"
    })
   delete user.password
    const finalLoginData={
        token,
        user:{
            ...user
        }
    }

    

    return finalLoginData
}


export const authServices = {
  createUserInDb,
  loginUserInDb
};
