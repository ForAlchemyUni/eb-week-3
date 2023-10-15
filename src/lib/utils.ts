import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date: Date) {
	return format(date, 'LLL dd, y');
}

export function formatTimestamp(timestamp: number) {
	const date = new Date(timestamp * 1000);
	const relativeTime = formatDistanceToNow(date, { addSuffix: true });
	const exactTime = format(date, 'MMM-dd-yyyy hh:mm:ss a OOOO');
	return `${relativeTime} (${exactTime})`;
}

export function formatNumber(number: number) {
	return new Intl.NumberFormat().format(number);
}

export function extractSegmentURL(path: string) {
	if (!path) return '';
	if (path === '/') return null;
	return path.split('/')[1];
}

export function capitalizer(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncateEthAddress(
	address: string,
	startLength: number = 6,
	endLength: number = 8
): string {
	if (!address.startsWith('0x') && address.length !== 42) {
		throw new Error('Invalid Ethereum address format');
	}
	return address.slice(0, startLength + 2) + '...' + address.slice(-endLength);
}

export function truncateHash(hash: string, startLength: number = 24): string {
	if (!hash.startsWith('0x') && hash.length !== 66) {
		throw new Error('Invalid hash format');
	}
	return hash.slice(0, startLength + 2) + '...';
}

export function noTrailingZeroPrecision(number: string, decimal: number = 2) {
	return parseFloat(number)
		.toFixed(decimal)
		.replace(/(\.0+|(\.\d*?[1-9])0+)$/, '$2');
}
