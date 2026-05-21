import { pool } from "../../database";
import type { IIssueQueryParams, IIssues } from "./issue.interface";

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

//get all issue with query param search

const getIssuesFromDbWithQuery = async (payload: IIssueQueryParams) => {
  const { sort = "newest", status, type } = payload;

  let queryText = `SELECT * FROM issues WHERE 1=1`;
  const queryParams: string[] = [];

  if (type) {
    queryParams.push(type);
    queryText += ` AND type=$${queryParams.length}`;

  }

  if (status) {
    queryParams.push(status);
    queryText += ` AND status=$${queryParams.length}`;
  }

  if (sort === "oldest") {
    queryText += ` ORDER BY created_at ASC`;
  } else {
    queryText += ` ORDER BY created_at DESC`;
  }

  const issueResult = await pool.query(queryText, queryParams);
 
  return issueResult;
};

export const issueServices = {
  createIssuesInDb,
  getIssuesFromDbWithQuery,
};
