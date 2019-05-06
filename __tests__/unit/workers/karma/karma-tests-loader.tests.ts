import { KarmaTestsLoader } from './../../../../src/workers/karma/karma-tests-loader';
import { KarmaRunner } from "../../../../src/workers/karma/karma-runner";
import { AngularServer } from "../../../../src/workers/servers/angular-server";
import { TestExplorerHelper } from "../../../../src/workers/test-explorer/test-explorer-helper";

jest.mock("../../../../src/workers/karma/karma-runner");
jest.mock("../../../../src/workers/servers/angular-server");
jest.mock("../../../../src/workers/test-explorer/test-explorer-helper");

let karmaRunnerMockedClass: jest.Mock<KarmaRunner>;
let angularServerMockedClass: jest.Mock<AngularServer>;
let testExplorerHelperMockedClass: jest.Mock<TestExplorerHelper>;

beforeAll(() => {
    karmaRunnerMockedClass = <jest.Mock<KarmaRunner>>KarmaRunner;
    angularServerMockedClass = <jest.Mock<AngularServer>>AngularServer;
    testExplorerHelperMockedClass = <jest.Mock<TestExplorerHelper>>TestExplorerHelper;
  });

test("loadTestsFromDefaultProject should throw an error if angular.json is not found", async () => {
    // Arrange
    const karmaTestsLoader = new KarmaTestsLoader("", "", new angularServerMockedClass(), new testExplorerHelperMockedClass(), new karmaRunnerMockedClass());

    // Act
    try {
        await karmaTestsLoader.loadTestsFromDefaultProject();
    } catch (error) {
        // Assert
        expect(error).toBe("Error: No angular.json or angular-cli.json file found in root path.");
    }
});