import bcrypt from "bcryptjs";

import type { IRegisterUser } from "./register.interface";
import { pool } from "../../../database";

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

export const registerServices = {
  createUserInDb,
};
