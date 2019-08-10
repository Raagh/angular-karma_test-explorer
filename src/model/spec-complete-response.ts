import { TestResult } from "./enums/test-status.enum";

export class SpecCompleteResponse {
  public id: string;
  public failureMessages: string[];
  public suite: string[];
  public description: string;
  public fullName: string;
  public status: TestResult;
  public timeSpentInMilliseconds: string;
  public filePath?: string;
  public line?: number;

  public constructor(
    _id: string,
    _failureMessages: string[],
    _suite: string[],
    _description: string,
    _fullName: string,
    _status: TestResult,
    _timeSpentInMilliseconds: string,
    _filePath?: string,
    _line?: number
  ) {
    this.id = _id;
    this.failureMessages = _failureMessages;
    this.suite = _suite;
    this.description = _description;
    this.fullName = _fullName;
    this.status = _status;
    this.timeSpentInMilliseconds = _timeSpentInMilliseconds;
    this.filePath = _filePath;
    this.line = _line;
  }
}
