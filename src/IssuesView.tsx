import React, { useState, useEffect } from "react";
import { GithubIssue } from "./shared";
import IssueItem from "./IssueItem";
import useKeyPress from "./useKeyPress";

import "./IssuesView.css";

interface IssuesViewProps {
	issues: GithubIssue[];
}

export const IssuesView: React.FC<IssuesViewProps> = ({ issues }) => {
	const downPress = useKeyPress("ArrowDown");
	const upPress = useKeyPress("ArrowUp");
	const [cursor, setCursor] = useState<number>(0);

	useEffect(() => {
		if (issues.length && downPress) {
			setCursor(prevState =>
				prevState < issues.length - 1 ? prevState + 1 : prevState
			);
		}
	}, [downPress]);
	useEffect(() => {
		if (issues.length && upPress) {
			setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
		}
	}, [upPress]);

	const renderIssues = () => {
		return issues.map((issue, i) => {
			return <IssueItem key={i} issue={issue} active={i === cursor} />;
		});
	};

	return <div className="issues-view">{renderIssues()}</div>;
};

export default IssuesView;
