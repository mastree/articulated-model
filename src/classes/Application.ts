import { CameraDefault, LightingDefault } from "../constant";
import m4 from "../utils/m4-utils";
import { degToRad } from "../utils/rotate-utils";
import Shape from "./Shape";

class Application {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  shapes: Shape[];
  selectedShape: Shape | null;
  camera: CameraConfig;
  projection: Projection;
  lighting: LightingConfig;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas;
    this.gl = gl;
    this.shapes = [];
    this.selectedShape = null;
    this.projection = "orthographic";
    this.camera = {
      radius: 1,
      angle: 0,
    };

    this.lighting = LightingDefault;
  }

  loadDataFromJSON(data: any) {
    // console.log(this);
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].loadData(data.shapes[i]);
    }

    // this.selectedShape?.loadData(data.selectedShape);
    this.camera = data.camera as CameraConfig;
    this.projection = data.projection as Projection;
    this.lighting = data.lighting as LightingConfig;

    // console.log(this);

    // this.render();
  }

  loadDefaults() {
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].loadDefaults();
    }
    this.camera = { ...CameraDefault };
    this.lighting = { ...LightingDefault };
    this.applyProjection();
    this.applyLighting();
  }

  setProjection(projection: Projection) {
    this.projection = projection;
  }

  // apply this.projection's matrix to shapes
  applyProjection() {
    let projectionMatrix = new Array<number>(16);
    const { radius } = this.camera;
    // const len = 2.5;
    const len = radius;
    const [left, right] = [-len, len];
    const [bottom, top] = [-len, len];
    const near = -300;
    const far = 300;

    switch (this.projection) {
      case "orthographic":
        projectionMatrix = m4.orthographic(left, right, bottom, top, near, far);
        break;
      case "oblique":
        const thetaSlider = document.getElementById(
          "oblique-theta"
        ) as HTMLInputElement;
        const phiSlider = document.getElementById(
          "oblique-phi"
        ) as HTMLInputElement;

        const thetaRad = degToRad(thetaSlider.valueAsNumber);
        const phiRad = degToRad(phiSlider.valueAsNumber);

        projectionMatrix = m4.multiply(
          m4.orthographic(left, right, bottom, top, near, far),
          m4.oblique(thetaRad, phiRad)
        );
        break;
      case "perspective":
        const { canvas } = this;
        const ratio = canvas.clientWidth / canvas.clientHeight;
        const fovSlider = document.getElementById(
          "perspective-fov"
        ) as HTMLInputElement;
        // const fov = 45;
        const fov = fovSlider.valueAsNumber;
        const field = (fov * Math.PI) / 180;
        const z_near = 0.1;
        const z_far = 100.0;

        projectionMatrix = m4.perspective(field, ratio, z_near, z_far);
        break;
    }

    for (const shape of this.shapes) {
      shape.setProjectionMatrix(projectionMatrix);
    }
  }

  applyViewTransform() {
    // let viewMatrix = new Array<number>(16);
    const { radius, angle } = this.camera;

    let cameraMatrix = m4.yRotation(degToRad(angle));
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    const viewMatrix = m4.inverse(cameraMatrix);

    for (const shape of this.shapes) {
      shape.setViewMatrix(viewMatrix);
    }
  }

  applyLighting() {
    for (const shape of this.shapes) {
      shape.setLightingConfig(
        this.lighting.ambientLightColor,
        this.lighting.directionalLightColor,
        this.lighting.directionalVector
      );
    }
  }

  toggleLighting(on: boolean) {
    for (const shape of this.shapes) {
      shape.toggleLighting(on);
    }
  }

  setCameraRadius(radius: number) {
    this.camera.radius = radius;
  }

  setCameraAngle(angle: number) {
    this.camera.angle = angle;
  }

  setSelectedShape(shapeIndex: number) {
    this.selectedShape = this.shapes[shapeIndex];
  }

  setAmbientLightColor(color: Color) {
    this.lighting.ambientLightColor = color;
  }

  setDirectionalLightColor(color: Color) {
    this.lighting.directionalLightColor = color;
  }

  setDirectionalVector(vector: TransformationInput) {
    this.lighting.directionalVector = vector;
  }

  render() {
    const { gl } = this;
    gl.clearDepth(1.0);
    gl.clearColor(1, 1, 1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.applyProjection();
    this.applyViewTransform();

    this.applyLighting();
    for (const shape of this.shapes) {
      shape.render();
    }
  }

  articulateRender() {
    const { gl } = this;
    gl.clearDepth(1.0);
    gl.clearColor(1, 1, 1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.applyProjection();
    this.applyViewTransform();

    this.applyLighting();
    let ident = m4.identity();
    this.articulateRenderDfs(this.shapes[0], ident);
  }

  articulateRenderDfs(node: Shape, ancestorsMat: number[]) {
    node.renderWith(ancestorsMat);
    let nanc = m4.multiply([...ancestorsMat], node.getLocalTransformation());
    for (const child of node.children) {
      this.articulateRenderDfs(child, nanc);
    }
  }

  save(el: any) {
    let str = "" as string;
    let arr = [] as any;
    // this.shapeList.forEach((element) => {
    //   arr.push(element.toSaveData());
    // });
    str = JSON.stringify(arr);
    console.log(JSON.parse(str));
    var data = "text/json;charset=utf-8," + encodeURIComponent(str);
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "data.json");
  }

  load(
    res: {
      // type: ShapeType;
      id: number;
      color: Color;
      selectedColor: Color;
      points: { id: number; pos: Point2d }[];
    }[]
  ) {
    // let arr: Shape[] = [];
    this.render();
  }
}

export default Application;
