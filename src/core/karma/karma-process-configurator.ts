import { SpawnOptions } from "child_process";

export class KarmaProcessConfigurator {
  public constructor() {}

  public createProcessOptions(projectRootPath: string, userKarmaConfigPath: string, defaultSocketPort: number) {
    const testExplorerEnvironment = Object.create(process.env);
    testExplorerEnvironment.userKarmaConfigPath = userKarmaConfigPath;
    testExplorerEnvironment.defaultSocketPort = defaultSocketPort;
    const options = {
      cwd: projectRootPath,
      shell: true,
      env: testExplorerEnvironment,
    } as SpawnOptions;
    return options;
  }

  public createProcessCommandAndArguments(baseKarmaConfigFilePath: string) {
    const command = "npx";
    const processArguments = ["karma", "start", baseKarmaConfigFilePath];

    return { command, processArguments };
  }
}
