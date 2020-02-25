export interface GithubIssue {
	url: string;
	title: string;
	user: GithubUser;
	state: string;
	createdAt: Date;
	updatedAt: Date;
	body: string;
	labels: GithubLabel[];
}

export interface GithubUser {
	login: string;
	id: number;
	avatarUrl: string;
}

export interface GithubLabel {
	id: number;
	node_id: string;
	url: string;
	name: string;
	color: string;
	default: boolean;
	description: string;
}
