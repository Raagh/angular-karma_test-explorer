export class SpecCompleteResponse {
  public failureMessages: string[];
  public suite: string;
  public description: string;
  public status: string;
  public timeSpentInMilliseconds: string;

  public constructor(_failureMessages: string[], _suite: string, _description: string, _status: string, _timeSpentInMilliseconds: string) {
    this.failureMessages = _failureMessages;
    this.suite = _suite;
    this.description = _description;
    this.status = _status;
    this.timeSpentInMilliseconds = _timeSpentInMilliseconds;
  }
}
