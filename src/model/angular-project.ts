export class AngularProject {
  public name: string;
  public rootPath: string;
  public karmaConfPath: string;
  public isAngularDefaultProject: boolean;

  public constructor(_name: string, _rootPath: string, _karmaConfPath: string, _isAngularDefaultProject: boolean) {
    this.name = _name;
    this.rootPath = _rootPath;
    this.karmaConfPath = _karmaConfPath;
    this.isAngularDefaultProject = _isAngularDefaultProject;
  }
}
