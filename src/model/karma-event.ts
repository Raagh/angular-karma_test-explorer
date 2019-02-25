export class KarmaEvent {
  public name: string;
  public results: any;

  public constructor(_name: string, _results: any) {
    this.name = _name;
    this.results = _results;
  }
}
