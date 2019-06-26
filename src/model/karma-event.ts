import { SpecCompleteResponse } from "./spec-complete-response";

export class KarmaEvent {
  public name: string;
  public results: SpecCompleteResponse;

  public constructor(_name: string, _results: any) {
    this.name = _name;
    this.results = _results;
  }
}
