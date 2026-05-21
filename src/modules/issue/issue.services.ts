import { pool } from "../../database";
import type { IIssues } from "./issue.interface";

const createIssuesInDb = async (payload: IIssues, reporter_id: string) => {
  const { title, description, type } = payload;

  //insert this info in the issues table

  const result = await pool.query(
    `
        INSERT INTO issues (title,description,type,status,reporter_id) VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `,
    [title, description, type, "open", reporter_id],
  );
  return result;
};

export const issueServices = {
  createIssuesInDb,
};
