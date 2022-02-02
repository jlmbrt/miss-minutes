module.exports = {
    roots: ["<rootDir>/tests"],
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    coverageDirectory: "test-report/coverage",
    collectCoverage: false,
    coverageReporters: ["text"],
    reporters: ["default"],
};
