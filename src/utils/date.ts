export function isOlderThan24Hours(isoString: string) {
	const inputDate = new Date(isoString);
	const now = new Date();
	const diff = now.getTime() - inputDate.getTime();
	return diff >= 24 * 60 * 60 * 1000;
}
