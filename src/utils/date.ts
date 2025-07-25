export function isOlderThan24Hours(isoString: string) {
	const inputDate = new Date(isoString);
	const now = new Date();
	const diff = now.getTime() - inputDate.getTime();
	return diff >= 24 * 60 * 60 * 1000;
}

export function getCurrentTimeInTimezone(timezone: string) {
	const now = new Date();
	return new Intl.DateTimeFormat('en-US', {
	  hour: '2-digit',
	  minute: '2-digit',
	  hour12: false,        // use 24-hour format
	  timeZone: timezone,   // e.g., 'Africa/Lagos'
	}).format(now);
}
