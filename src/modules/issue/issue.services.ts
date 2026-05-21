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
  const finalAllIssues = issueResult.rows;

  //get reporter details as well who reporeted that report

  const getReporterUniqueId = [
    ...new Set(finalAllIssues.map((issue) => issue.reporter_id)),
  ];

  const userQueryIds = getReporterUniqueId
    .map((id, index) => `$${index + 1}`)
    .join(",");

  //now fetch reporter data who made issues we need this [$1,$2]

  const getReporterData = await pool.query(
    `
    SELECT id,name,role FROM users WHERE id IN (${userQueryIds})
  `,
    getReporterUniqueId,
  );

  const reporters = getReporterData.rows;

  const finalResult = finalAllIssues.map((issue) => {
    const { reporter_id, created_at, updated_at, ...rest } = issue;

    return {
      ...rest,
      reporter: reporters.find((reporter) => reporter.id == reporter_id),
      created_at,
      updated_at,
    };
  });

  return finalResult;
};

//get single issue
const getSingleIssue = async (id: string) => {
  const numberId = parseInt(id);

  const result = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
  `,
    [numberId],
  );

  const issueData = result.rows[0];

  const { reporter_id } = issueData;

  const getReporterData = await pool.query(
    `
  SELECT id,name,role FROM users WHERE id=$1
`,
    [reporter_id],
  );
  const reporterData = getReporterData.rows[0];
  delete issueData.reporter_id;

  const { created_at, updated_at, ...rest } = issueData;
  const finalResult = {
    ...rest,
    reporter: {
      ...reporterData,
    },
    created_at,
    updated_at,
  };

  return finalResult;
};
export const issueServices = {
  createIssuesInDb,
  getIssuesFromDbWithQuery,
  getSingleIssue,
};
