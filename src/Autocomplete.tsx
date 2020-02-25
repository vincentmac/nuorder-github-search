import React, { useState, useEffect, useRef, useContext } from "react";
import useDebounce from "./useDebounce";
// import { GithubIssue } from './shared';
import IssueContext from "./issueContext";

import './Autocomplete.css';

export const Autocomplete: React.FC = () => {
	const context = useContext(IssueContext);
	// State and setter for
	const [query, setQuery] = useState<string>("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	// const [issues, setIssues] = useState<GithubIssue[]>([]);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [highlightIndex, setHighlightIndex] = useState<number>(0);
	const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Prevent api rate limiting by waiting for user to finish input
	// useDebounce will set the value after a delay
	const delay = 300; //ms
	const debouncedQuery = useDebounce(query, delay);

	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		// console.log("onChangeHandler", value);
		setQuery(value);
		setShowSuggestions(true);
	};

	// listen for changes on debouncedQuery to trigger api call
	useEffect(() => {
		// console.log("*useEffect", debouncedQuery);
		if (!debouncedQuery) {
			setSuggestions([]);
			setShowSuggestions(false);
			// context?.setIssues([]);
			return;
		}
		querySuggestions(debouncedQuery).then(items => {
			setSuggestions(items);
			// setShowSuggestions(true);
			console.log('post debouncedQuery querySuggestions');
		});
	}, [debouncedQuery]);

	const keyupHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const ENTER_KEY = 13;
		const ESCAPE_KEY = 27;
		const DOWN_KEY = 40;
		const UP_KEY = 38;
		// const value = event.currentTarget.value;
		
		switch (event.keyCode) {
			case ENTER_KEY:
				// query full results
				let q = event.currentTarget.value.trim();
				if (isHighlighted){
					q = suggestions[highlightIndex];
					setQuery(q);
					console.log("enter key query", q)
					// break;
				}
				// remove focus from input box
				inputRef.current?.blur();
				setShowSuggestions(false);
				queryIssues(q).then(newIssues => {
					console.log('issues', newIssues);
					// setIssues(newIssues);
					context?.setIssues(newIssues);
					resetSuggestions();
				});
				
				break;

			case DOWN_KEY:
				if (!isHighlighted || highlightIndex === suggestions.length - 1) {
					setIsHighlighted(true);
					setHighlightIndex(0);
					setShowSuggestions(true);
					break;
				}
				setHighlightIndex(highlightIndex+1);
				break;

			case UP_KEY:
				if (!isHighlighted || highlightIndex === 0) {
					setIsHighlighted(true);
					setHighlightIndex(suggestions.length - 1);
					setShowSuggestions(true);
					break;
				}
				setHighlightIndex(highlightIndex - 1);
				break;

			case ESCAPE_KEY:
				resetSuggestions();
				// setHighlightIndex(0);
				// setIsHighlighted(false);
				// setShowSuggestions(false);
				break;

			default:
				break;
		}
	};

	const resetSuggestions = () => {
		setHighlightIndex(0);
		setIsHighlighted(false);
		setShowSuggestions(false);

	}

	// Query for autocomplete suggestions. Ideally, this would be an endpoint
	// specifically designed to return only titles (alternatively, could use
	// graphql to request only title in the result set)
	const querySuggestions = async (q: string) => {
		const searchQuery = `https://api.github.com/search/issues?q=${q}+repo:facebook/react`;
		return fetch(searchQuery)
			.then(res => {
				//console.log('query res', res);
				// check status code before proceeding
				if (res.status !== 200) {
					throw new Error(
						`API Error: ${res.status}, ${res.statusText}`
					);
				}
				return res.json();
			})
			.then(data => {
				//console.log('data', data);
				if (!data.items) {
					return [];
				}
				return data.items.map((item: any) => item.title);
			});
	};

	// Query Full Issue Result Set
	const queryIssues = async (q: string) => {
		const searchQuery = `https://api.github.com/search/issues?q=${q}+repo:facebook/react`;
		return fetch(searchQuery)
			.then(res => {
				//console.log('query res', res);
				// check status code before proceeding
				if (res.status !== 200) {
					throw new Error(
						`API Error: ${res.status}, ${res.statusText}`
					);
				}
				return res.json();
			})
			.then(data => {
				// console.log("issue data", data);
				if (!data.items) {
					return [];
				}
				return data.items.map((item: any) => {
					return {
						url: item.url,
						title: item.title,
						user: {
							login: item.user.login,
							id: item.user.id,
							avatarUrl: item.user.avatar_url
						},
						state: item.state,
						createdAt: item.created_at,
						updatedAt: item.updated_at,
						body: item.body,
						labels: item.labels
					};
				});
			});
	};

	const renderSuggestions = () => {
		// console.log('renderSuggestions', suggestions);
		if (!showSuggestions) {
			return;
		}

		return (
			<div className="suggestions">
				{suggestions.map((item, i) => (
					<div key={i} className={ isHighlighted && highlightIndex === i ? "highlight" : ""}>{item}</div>
				))}
			</div>
		);
	};

	return (
		<IssueContext.Consumer>
			{context => {
				return (
					<React.Fragment>
						<div className="search">
							<input
								type="text"
								value={query}
								ref={inputRef}
								onKeyUp={keyupHandler}
								onChange={onChangeHandler}
								className="search-box"
							/>
						</div>
					{showSuggestions && renderSuggestions()}
				</React.Fragment>
			)
			}}
		</IssueContext.Consumer>
	);
};

export default Autocomplete;
