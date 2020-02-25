import React, {useState} from 'react';

import Autocomplete from './Autocomplete';
import IssuesView from "./IssuesView";
import IssueContext, { ContextProps } from './issueContext';

import './App.css';
import {GithubIssue} from './shared';

// search github issues: https://api.github.com/search/issues?q=expected+repo:facebook/react
// and https://help.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search


const App: React.FC = () => {
	
	const [issues, setIssues] = useState<GithubIssue[]>([]);
	const setIssuesProvider = (issues: GithubIssue[]) => {
		setIssues(issues);
	};

	const initialContext: ContextProps = {
		query: "",
		issues: [],
		setIssues: setIssuesProvider
	};

  return (
    <div className="container">
		<IssueContext.Provider
			value={initialContext}
		>
			<header className="header">
				<h1>React Issue Search</h1>
				<Autocomplete />
			</header>
			<div className="sidebar">sidebar</div>
			<main className="content">
				<IssuesView issues={issues} /> 
			</main>
			<div className="footer">footer</div>
		</IssueContext.Provider>
    </div>
  );
}

export default App;
