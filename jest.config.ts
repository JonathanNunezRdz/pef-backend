import type { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleDirectories: ['node_modules'],
	rootDir: '.',
	roots: ['<rootDir>'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	moduleNameMapper: {
		'@src/(.*)': '<rootDir>/src/$1',
		'@customTypes': '<rootDir>/types/index.ts',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	verbose: true,
};

export default config;

// "jest": {
// 		"moduleFileExtensions": [
// 			"js",
// 			"json",
// 			"ts"
// 		],
// 		"rootDir": "src",
// 		"testRegex": ".*\\.spec\\.ts$",
// 		"transform": {
// 			"^.+\\.(t|j)s$": "ts-jest"
// 		},
// 		"collectCoverageFrom": [
// 			"**/*.(t|j)s"
// 		],
// 		"coverageDirectory": "../coverage",
// 		"testEnvironment": "node"
// 	},
