module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true,
        "node": true
    },
    "rules": {
        "no-console": 0,
        "no-param-reassign": ["error", { "props": false }],
        "class-methods-use-this": 0
    }
};
