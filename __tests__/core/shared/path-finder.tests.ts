import { PathFinder } from "../../../src/core/shared/path-finder";
import { FileHelper } from "../../../src/core/integration/file-helper";
import * as mockParsedTestFiles from "../../../__mocks__/parsedTestFiles.mock";
import * as mockTestFileData from "../../../__mocks__/testFileData.mock";
import * as lodash from "lodash";

jest.mock("../../../src/core/integration/file-helper");

const testFileData: any = mockTestFileData.mock;
const parsedTestFiles: any = mockParsedTestFiles.mock;

let fileHelper: jest.Mocked<FileHelper>;
let pathFinder: PathFinder;

describe("Path finder tests", () => {
  beforeAll(() => {
    fileHelper = new (FileHelper as any)() as any;
    fileHelper.readFile.mockImplementation((path: string, encoding: any) => testFileData[path]);
    pathFinder = new PathFinder(fileHelper);
  });

  describe("Parsing test files", () => {
    describe("Test files with single test cases", () => {
      it("Parsed test paths matched expected test paths", () => {
        const result = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        expect(lodash.isEqual(result, parsedTestFiles)).toBe(true);
      });

      it("1st test file match suite 1 and description 1", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t1.spec.js"];
        expect(path.describe[0]).toBe("s1");
        expect(path.it[0]).toBe("d1");
      });

      it("2sd test file match suite 2 and description 2", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t2.spec.js"];
        expect(path.describe[0]).toBe("s2");
        expect(path.it[0]).toBe("d2");
      });

      it("3rd test file match suite 3 and description 3.1 and 3.2", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t3.spec.js"];
        expect(path.describe[0]).toBe("s3");
        expect(path.it[0]).toBe("d3.1");
        expect(path.it[1]).toBe("d3.2");
      });

      describe("Test cases with quoted text", () => {
        it("4rd test file match suite and description with single quotes", () => {
          const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
          const path: any = paths["path/t4.spec.js"];
          expect(path.describe[0]).toBe("\\'s4\\'");
          expect(path.it[0]).toBe("\\'d4\\'");
        });

        it("5th test file match suite and description with double quotes", () => {
          const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
          const path: any = paths["path/t5.spec.js"];
          expect(path.describe[0]).toBe('\\"s5\\"');
          expect(path.it[0]).toBe('\\"d5\\"');
        });
      });
    });

    describe("Test files with multiple test cases", () => {
      it("6th test file match suite 6 and description 6.1", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t6.spec.js"];
        expect(path.describe[0]).toBe("s6");
        expect(path.it[0]).toBe("d6.1");
      });

      it("6th test file match suite 6.2 and description 6.2 (sibling)", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t6.spec.js"];
        expect(path.describe[1]).toBe("s6.2");
        expect(path.it[1]).toBe("d6.2");
      });

      it("6th test file match suite 6.3 and description 6.3 (sibling)", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t6.spec.js"];
        expect(path.describe[2]).toBe("s6.3");
        expect(path.it[2]).toBe("d6.3");
      });

      it("6th test file match suite 6.4.1 and description 6.4.1 (nested)", () => {
        const paths: any = pathFinder.getTestFilesPaths("**/*.spec.ts", "utf-8");
        const path: any = paths["path/t6.spec.js"];
        expect(path.describe[4]).toBe("s6.4.1");
        expect(path.it[3]).toBe("d6.4.1");
      });
    });
  });

  describe("Find test file path tests", () => {
    it("Test file path not found", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s7", "d7")).toBeUndefined();
    });

    it("Suite 1 and description 1 found in test file 1", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s1", "d1")).toBe("path/t1.spec.js");
    });

    it("Suite 2 and description 2 found in test file 2", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s2", "d2")).toBe("path/t2.spec.js");
    });

    it("Suite 3 and description 3 found in test file 3.1", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s3", "d3.1")).toBe("path/t3.spec.js");
    });

    it("Suite 3 and description 3 found in test file 3.2", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s3", "d3.2")).toBe("path/t3.spec.js");
    });

    it("Suite 4 and description 4 found in test file 4", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "\\'s4\\'", "\\'d4\\'")).toBe("path/t4.spec.js");
    });

    it("Suite 5 and description 5 found in test file 5", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, '\\"s5\\"', '\\"d5\\"')).toBe("path/t5.spec.js");
    });

    it("Suite 6 and description 6 found in test file 6", () => {
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s6", "d6.1")).toBe("path/t6.spec.js");
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s62", "d6.2")).toBe("path/t6.spec.js");
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s63", "d6.3")).toBe("path/t6.spec.js");
      expect(pathFinder.getTestFilePath(parsedTestFiles, "s6.4.1text", "d6.4.1text")).toBe("path/t6.spec.js");
    });
  });
});
