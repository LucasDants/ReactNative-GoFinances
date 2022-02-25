module.exports = {
    preset: "jest-expo",
    testPathIgnorePatterns: [
        '/node_modules',
        "/android",
        "/ios"
    ],
    setupFilesAfterEnv: [
        "@testing-library/jest-native/extend-expect",
        "jest-styled-components",
        'jest-fetch-mock'
    ],
    setupFiles: ["./setupFile.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.tsx',
        "!src/**/*.spec.tsx",
    ],
    coverageReporters: [
        'lcov'
    ]
}