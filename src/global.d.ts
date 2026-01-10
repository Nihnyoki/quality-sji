/// <reference types="vite/client" />

declare const __WB_MANIFEST: Array<any>;

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: any[]) => void;
	}
}

export {};