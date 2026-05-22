
export type TResponseGlobal<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};



//roles

export const Roles={
    CONTRIBUTOR:"contributor",
    MAINTAINER:"maintainer"
} as const


//query types

export interface IIssueQuery{
    sort?:"newest" | "oldest",
    status?: "open" | "in_progress" | "resolved";
    type?: "bug" | "feature_request";
}