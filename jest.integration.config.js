module.exports = {
    roots: ["<rootDir>"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__integration-tests__/.*|(\\.|/)(integration-tests))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  };