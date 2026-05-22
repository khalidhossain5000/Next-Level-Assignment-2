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

//update issue in the db

const updateIssueInDb = async (id: string, jwtPayload: any, payload: any) => {
  const { title, description, type } = payload;
  const { id: userId, role } = jwtPayload;

  //check if the issue available on the db or not

  const getAllIssue = await pool.query(
    `
  SELECT * FROM issues WHERE id=$1
  `,
    [id],
  );

  if (getAllIssue.rows.length === 0) {
    throw new Error("Issue is not available"); //404 error
  }
  const issue = getAllIssue.rows[0];

  //access finder
  const isMaintainer = role === "maintainer";
  const isOwner = userId === issue.reporter_id;
  const isIssueOpen = issue.status === "open";
  const hasAccess =
    isMaintainer || (role === "contributor" && isOwner && isIssueOpen);

  if (!hasAccess) {
    throw new Error("Forbidden access");
  }
  //maintainer role direct access to update

  const result = await pool.query(
    `
    UPDATE issues  SET title=COALESCE($1,title),description=COALESCE($2,description), type=COALESCE($3,type),status=$4 WHERE id=$5
    RETURNING *
  `,
    [title, description, type, "in_progress",id],
  );

  return result;
};


//DELETE ISSUE

const deleteIssueFromDb=async(id:string)=>{
  const result=await pool.query(`
    DELETE FROM issues WHERE id=$1
  `,[id])
  console.log(result,'dlete resutl')
    if (result.rows.length === 0) {
    throw new Error("Issue not found");
  }
  return result
}







export const issueServices = {
  createIssuesInDb,
  getIssuesFromDbWithQuery,
  getSingleIssue,
  updateIssueInDb,
  deleteIssueFromDb
};
