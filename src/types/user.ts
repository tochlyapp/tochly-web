export type BaseUser = {
	first_name: string;
	last_name: string;
	email: string;
	timezone: string;
};

export type User = BaseUser & {
	id: number;
}
