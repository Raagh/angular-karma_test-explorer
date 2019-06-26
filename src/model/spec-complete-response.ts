import { TestResult } from "./enums/test-status.enum";

export class SpecCompleteResponse {
  public failureMessages: string[];
  public suite: string[];
  public description: string;
  public status: TestResult;
  public timeSpentInMilliseconds: string;
  public filePath?: string;

  public constructor(
    _failureMessages: string[],
    _suite: string[],
    _description: string,
    _status: TestResult,
    _timeSpentInMilliseconds: string,
    _filePath?: string
  ) {
    this.failureMessages = _failureMessages;
    this.suite = _suite;
    this.description = _description;
    this.status = _status;
    this.timeSpentInMilliseconds = _timeSpentInMilliseconds;
    this.filePath = _filePath;
  }
}
