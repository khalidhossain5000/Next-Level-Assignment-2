import type { Response } from "express";
import type { IIssueQuery } from "../types/types";

const issueFilterValidation = (res: Response, query: IIssueQuery) => {
  const { sort, status, type } = query;
  const validSorts = ["newest", "oldest"];
  const validStatus = ["open", "in_progress", "resolved"];
  const validType = ["bug", "feature_request"];

  if (sort && !validSorts.includes(sort as string)) {
    res.status(400).json({
      success: false,
      message: `Invalide query. Allowed queries are: ${validSorts.join(",")}`,
    });
    return;
  }

  if (status && !validStatus.includes(status as string)) {
    res.status(400).json({
      success: false,
      message: `Invalide query. Allowed queries are: ${validStatus.join(",")}`,
    });
    return;
  }

  if (type && !validType.includes(type as string)) {
    res.status(400).json({
      success: false,
      message: `Invalide query. Allowed queries are: ${validType.join(",")}`,
    });
    return;
  }
};

export default issueFilterValidation;
