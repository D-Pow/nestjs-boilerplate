import path from 'node:path';

import tsconfig from '../tsconfig.json' with { type: 'json' };

const rootDir = path.resolve(import.meta.dirname, '..');
const coverageDirectory = path.resolve(rootDir, 'coverage');

function stripTrailingSlashAndStar(str) {
	return str.replace(/[*/]*$/, '');
}

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
	testEnvironment: 'node',
	moduleFileExtensions: [
		'js',
		'json',
		'ts',
	],
	rootDir,
	testRegex: '.*\\.(test|spec)\\.[tj]s$',
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	testPathIgnorePatterns: [
		'node_modules',
		'dist',
	],
	// Import alias remapping: { '@': 'src' } => { '^@/(.*)$': '<rootDir>/src/$1' }
	moduleNameMapper: Object.entries(tsconfig.compilerOptions.paths).reduce((obj, [ aliasGlob, [ importPathGlob ]]) => {
		const aliasRegex = `^${stripTrailingSlashAndStar(aliasGlob)}/(.*)$`;
		const importPathRegex = `<rootDir>/${stripTrailingSlashAndStar(importPathGlob)}/$1`;

		obj[aliasRegex] = importPathRegex;

		return obj;
	}, {}),
	collectCoverageFrom: [
		'**/*.(t|j)s',
	],
	coverageDirectory,
};
