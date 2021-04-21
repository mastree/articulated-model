import { canvas, gl } from "@/sauce";
import { CameraDefault, LightingDefault } from "../constant";
import m4 from "../utils/m4-utils";
import { degToRad } from "../utils/rotate-utils";
import { Cube } from "./Cube";
import { Model } from "./Models/Model";
import { Spider } from "./Models/Spider";
import Shape from "./Shape";

class Application {
  models: Model[] = [];
  shapes: Shape[] = [];
  selectedShape: Shape | null = null;
  camera: CameraConfig;
  projection: Projection;
  lighting: LightingConfig;
  selectedShader: number = 1;

  constructor() {
    this.projection = "orthographic";
    this.camera = {
      radius: 1,
      angle: 0,
    };

    this.lighting = LightingDefault;
  }

  getSaveApp(): any{
    type SaveApplication = {
      models: any[];
      selectedShader: number;
    };
    var ret: SaveApplication = {
      models: [],
      selectedShader: this.selectedShader
    }
    for (const model of this.models){
      ret.models.push(model.getSaveModel());
    }
    return ret;
  }

  loadDataFromJSON(data: any) {
    this.models = [];
    for (const model of data.models){
      var dummy = new Spider("test");
      dummy.loadModel(model);
      this.models.push(dummy);
    }
    this.setSelectedModel(0);
    this.setSelectedShape(0);
    this.setSelectedShader(this.selectedShader);
  }

  loadDefaults() {
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
    const { radius, angle } = this.camera;
    let camPos = [0, 0, 0, 1];

    let cameraMatrix = [
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ];
    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(angle));
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    let mrot = m4.yRotation(degToRad(angle));
    let mtrans = m4.translation(0, 0, radius * 1.5);

    let nCam = [0, 0, 0, 0];
    for (let i=0;i<4;i++){
      for (let j=0;j<4;j++){
        nCam[i] += camPos[j] * mtrans[j * 4 + i];
      }
    }
    camPos = [...nCam];
    nCam = [0, 0, 0, 0];
    for (let i=0;i<4;i++){
      for (let j=0;j<4;j++){
        nCam[i] += camPos[j] * mrot[j * 4 + i];
      }
    }
    camPos = [...nCam];

    const viewMatrix = m4.inverse(cameraMatrix);

    for (const shape of this.shapes) {
      shape.setViewMatrix(viewMatrix);
      shape.setWorldCamPos(camPos.slice(0, 3));
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
    for (const model of this.models) {
      for (const shape of model.shapes) {
        shape.toggleLighting(on);
      }
    }
  }

  toggleAnimation(on: boolean) {
    for (const shape of this.shapes) {
      shape.animate = on;
    }
  }

  setCameraRadius(radius: number) {
    this.camera.radius = radius;
  }

  setCameraAngle(angle: number) {
    this.camera.angle = angle;
  }

  setSelectedModel(modelIndex: number) {
    this.shapes = this.models[modelIndex].shapes;
    this.selectedShape = this.shapes[0];
    this.setSelectedShader(this.selectedShader);
  }

  setSelectedShape(shapeIndex: number) {
    this.selectedShape = this.shapes[shapeIndex];
  }

  setAmbientLightColor(color: Vec3) {
    this.lighting.ambientLightColor = color;
  }

  setDirectionalLightColor(color: Vec3) {
    this.lighting.directionalLightColor = color;
  }

  setDirectionalVector(vector: TransformationInput) {
    this.lighting.directionalVector = vector;
  }

  render() {
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

  setSelectedShader(num: number){
    this.selectedShader = num;
    for (const model of this.models){
      for (const shape of model.shapes){
        shape.setSelectedShader(this.selectedShader);
      }
    }
  }

  articulateRender(delta: number) {
    gl.clearDepth(1.0);
    gl.clearColor(1, 1, 1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.applyProjection();
    this.applyViewTransform();

    this.applyLighting();
    let ident = m4.identity();
    this.shapes[0].initShader();
    this.articulateRenderDfs(delta, this.shapes[0], ident);
  }

  articulateRenderDfs(delta: number, node: Shape, ancestorsMat: number[]) {
    node.addTime(delta);
    node.renderWith(ancestorsMat);
    let nanc = m4.multiply([...ancestorsMat], node.getLocalTransformation());
    for (const child of node.children) {
      this.articulateRenderDfs(delta, child, nanc);
    }
  }

  save(el: any) {
    let str = "" as string;
    let arr = [] as any;
    str = JSON.stringify(arr);
    console.log(JSON.parse(str));
    var data = "text/json;charset=utf-8," + encodeURIComponent(str);
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "data.json");
  }

  load(
    res: {
      id: number;
      color: Vec3;
      selectedColor: Vec3;
      points: { id: number; pos: Vec2 }[];
    }[]
  ) {
    this.render();
  }
}

export default Application;
