export default {
	testEnvironment: "node",
	transform: {},
	extensionsToTreatAsEsm: [".js"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	testMatch: ["**/tests/**/*.test.js"],
	collectCoverageFrom: [
		"controllers/**/*.js",
		"lib/**/*.js",
		"middleware/**/*.js",
		"!**/node_modules/**",
	],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "html"],
	verbose: true,
};
