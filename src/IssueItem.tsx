import React from "react";
import { GithubIssue } from "./shared";

interface IssueItemProps {
	issue: GithubIssue;
	active: boolean
}

export const IssueItem: React.FC<IssueItemProps> = ({ issue, active }) => {
	const renderLabels = () => {
		return issue.labels.map((label, i) => {
			return (
				<div
					className="issue-item__label"
					key={i}
					style={{ background: "#" + label.color }}
				>
					{label.name}
				</div>
			);
		});
	};

	return (
		<div className={active ? "issue-item active" : "issue-item"}>
			<div>User: {issue.user.login}</div>
			<div>{issue.title}</div>
			<div>{issue.url}</div>
			<div className="issue-item__label-list">{renderLabels()}</div>
		</div>
	);
};

export default IssueItem;
