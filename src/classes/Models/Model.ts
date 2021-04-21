import Shape from "../Shape";
import { Cube } from "../Cube";

export abstract class Model {
  // shapes[0] is the root
  public shapes: Shape[] = [];
  constructor(public name: string) {
    // naon euy
  }

  abstract createModel(): void;

  getSaveModel(): any{
    type SaveModel = {
      name: string;
      shapes: Shape[];
    }
    var ret: SaveModel = {
      name: this.name,
      shapes: []
    };
    ret.shapes.push(this.shapes[0].getSaveShape());
    return ret;
  }

  loadModel(model: any){
    while (this.shapes.length > 0){
      this.shapes.pop();
    }
    var ncube = new Cube("Shape 0");
    ncube.loadTopData(model.shapes[0]);
    this.shapes.push(ncube);
    this.name = model.name;
    for (const child of model.shapes[0].children){
      this.dfsLoadModel(child, ncube);
    }
  }

  dfsLoadModel(node: any, parent: Shape){
    var ncube = new Cube("Shape " + this.shapes.length)
    ncube.loadTopData(node);
    this.shapes.push(ncube);
    parent.addChild(ncube);
    for (const child of node.children){
      this.dfsLoadModel(child, ncube);
    }
  }
}
