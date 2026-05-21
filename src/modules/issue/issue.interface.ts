
export interface IIssues{
    title:string;
    description:string;
    type:"bug" | "feature_request"
}


export interface IIssueQueryParams{
    sort?:'newest' | 'oldest';
    type?:'bug' | 'feature_request';
    status?:'open' | 'in_progress' | 'resolved'
}