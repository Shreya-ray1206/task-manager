module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "script",   // IMPORTANT → allows require(), module.exports
    },
    extends: ["eslint:recommended"],
    rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
        "max-len": ["error", { code: 120 }],
    },
}; 