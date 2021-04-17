import { gl } from "../sauce";
import m4 from "../utils/m4-utils";
import Shape from "./Shape";

class ArticulationNode {
  shape: Shape;
  children: ArticulationNode[];

  constructor(shape: Shape) {
    this.shape = shape;
    this.children = [];
  }
}

export const renderArticulateObject = (root: ArticulationNode) => {
  gl.clearDepth(1.0);
  gl.clearColor(1, 1, 1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  let ident = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  renderArticulateObjectDfs(root, ident);
};

export const renderArticulateObjectDfs = (
  node: ArticulationNode,
  ancestorsMat: number[]
) => {
  node.shape.renderWith(ancestorsMat);
  let nanc = m4.multiply(
    [...ancestorsMat],
    node.shape.getLocalTransformation()
  );
  for (const child of node.children) {
    renderArticulateObjectDfs(child, nanc);
  }
};

export default ArticulationNode;
