module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended", 
  "parserOptions": {
    "ecmaVersion": 5
  },
  "globals": {
    "JZZ": "readonly",
    "define": "readonly"
  },
  "overrides": [
    {
      "files": ["test/*"],
      "globals": {
        "after": "readonly",
        "before": "readonly",
        "describe": "readonly",
        "it": "readonly"
      },
      "rules": {
        "no-console" : "off"
      }
    }
  ]
};