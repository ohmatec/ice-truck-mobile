// Temporary module declarations to satisfy TypeScript in projects without @types packages
declare module 'react';
declare module 'react/jsx-runtime';

// Allow any JSX intrinsic elements so React Native components like <View/> are accepted
declare global {
	namespace JSX {
		interface IntrinsicElements {
			[elemName: string]: any;
		}
	}
}
