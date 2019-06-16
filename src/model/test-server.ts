import { TestExplorerConfiguration } from "./test-explorer-configuration";

export abstract class TestServer {
  public abstract async start(config: TestExplorerConfiguration): Promise<void>;
  public abstract stop(): void;
  public abstract async stopAsync(): Promise<void>;
}
