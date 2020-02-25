import React from "react";
import { GithubIssue } from './shared';

export interface ContextProps {
	query: string,
	issues: GithubIssue[],
	setIssues: (issues: GithubIssue[]) => void,
}
const IssueContext = React.createContext<ContextProps | null>(null);

export default IssueContext;
