import bcrypt from "bcryptjs";
import { pool } from "../../database";
import type { ILoginUser, IRegisterUser } from "./auth.interface";
import configuration from "../../config/config";
import jwt from "jsonwebtoken";
import { Roles } from "../../types/types";

const createUserInDb = async (payload: IRegisterUser) => {
  const { name, email, password, role = Roles.CONTRIBUTOR } = payload;
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

const loginUserInDb = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  //checking if user is exist on db
  if (result.rows.length === 0) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const user = result.rows[0];
  //now user is exist but is the password is correct lets check
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error: any = new Error(
      "Invalid login credentials! Check email or password and try again",
    );
    error.statusCode = 403;
    throw error;
  }
  //now password and user both are valid now lets generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(
    jwtPayload,
    configuration.jwtAccessTokenSecret as string,
    {
      expiresIn: "2d",
    },
  );
  delete user.password;
  const finalLoginData = {
    token,
    user: {
      ...user,
    },
  };

  return finalLoginData;
};

export const authServices = {
  createUserInDb,
  loginUserInDb,
};
