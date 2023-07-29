module.exports = {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/__tests__"
    ],
    "testMatch": [
        "<rootDir>/__tests__/*.ts",
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}