export class TreeNode {
  public id: string;
  public name: string;
  public type: string;
  public children: TreeNode[] = [];

  public constructor(id: string, name: string, type: string, child?: TreeNode) {
    this.id = id;
    this.name = name;
    this.type = type;
    if (child) {
      this.children.push(child);
    }
  }
}
