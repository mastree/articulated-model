import { Cube } from "@/classes/Cube";
import { Model } from "@/classes/Models/Model";

export class ChainCube extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;
    const cube = new Cube("First Cube", {
      center: [0, 0, 0],
      size: [2, 2, 2],
    });
    const cube2 = new Cube("Second Cube");
    const cube3 = new Cube("Third Cube");

    cube.addChild(cube2);
    cube2.addChild(cube3);
    shapes.push(cube);
    cube2.setAnchorPoint([1, 1, 1]);
    shapes.push(cube2);
    cube3.setAnchorPoint([1, 1, 1]);
    shapes.push(cube3);
  }
}
