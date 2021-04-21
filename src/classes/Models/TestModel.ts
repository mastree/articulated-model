import { Cube } from "@/classes/Cube";
import { Model } from "@/classes/Models/Model";

export class TestModel extends Model {
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
    const cube4 = new Cube("Fourth Cube");

    cube.addChild(cube2);
    cube2.addChild(cube3);
    cube3.addChild(cube4);
    cube2.setAnchorPoint([2, 2, 2]);
    cube3.setAnchorPoint([2, 2, 2]);
    cube4.setAnchorPoint([2, 2, 2]);
    shapes.push(cube);
    shapes.push(cube2);
    shapes.push(cube3);
    shapes.push(cube4);
  }
}
