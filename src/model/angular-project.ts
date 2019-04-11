export class AngularProject {
    public name:string;
    public rootPath: string;
		public karmaConfPath: string;
		
		public constructor(_name:string, _rootPath:string, _karmaConfPath:string) {
			this.name = _name;
			this.rootPath = _rootPath;
			this.karmaConfPath = _karmaConfPath;
    }
}
