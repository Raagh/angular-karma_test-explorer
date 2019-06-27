import * as mockTestFileData from "./testFileData.mock";

const sync = jest.fn(() => Object.keys(mockTestFileData.mock));

export { sync };
