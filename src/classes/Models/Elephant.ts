import { Cube } from "@/classes/Cube";
import { Wing } from "@/classes/Wing";
import { Model } from "@/classes/Models/Model";
import { degToRad, vDegToRad } from "@/utils/rotate-utils";
import { DefaultSubConfig } from "@/utils/animate-utils";

export class Elephant extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;

    // Head
    const headSize: Vec3 = [2.5, 2.5, 2.5];
    const head = new Cube("Head", {
      center: [0, 0, 0],
      size: headSize,
    });
    head.setAnimationConfig({
      rotation: [
        { offset: 0, min: -18, max: 10 },
        { offset: 0, min: -5, max: 5 },
        DefaultSubConfig,
      ],
    });

    // Neck
    const neckSize: Vec3 = [0.75, 0.75, 0.75];
    const neck = new Cube("Neck", {
      center: [0, 0, 0],
      size: neckSize,
    });
    neck.setAnimationConfig({
      rotation: [
        DefaultSubConfig,
        { offset: 0, min: -10, max: 10 },
        DefaultSubConfig,
      ],
    });

    // Body
    const bodySize: Vec3 = [3, 2.75, 4];
    const body = new Cube("Body", {
      center: [0, 0, 0],
      size: bodySize,
    });
    body.setAnimationConfig({
        rotation: [
            DefaultSubConfig,
            { offset: -40, min: 0, max: 0 },
            DefaultSubConfig,
        ],
    });
    
    body.setAnchorPoint([1, 1, 1])
    body.addChild(neck);
    neck.setAnchorPoint([0, 0.5, bodySize[2] / 2 + neckSize[2] / 2]);
    neck.addChild(head);
    head.setAnchorPoint([0, 0, neckSize[2] / 2 + headSize[2] / 2 - 0.5]);
    
    // Ear
    const earSize: Vec3 = [2.1, 3, 0.5];
    const leftEar = new Cube("LeftEar", {
        center: [0, -earSize[1] / 2, 0],
        size: earSize,
    });
    leftEar.setAnimationConfig({
        rotation: [
            { offset: -15, min: 0, max: 15 },
            { offset: 30, min: -10, max: 20},
            DefaultSubConfig
        ]
    });
    const rightEar = new Cube("RightEar", {
        center: [0, -earSize[1] / 2, 0],
        size: earSize,
    });
    rightEar.setAnimationConfig({
        rotation: [
            { offset: -15, min: 0, max: 15 },
            { offset: -30, min: -10, max: 20},
            DefaultSubConfig
        ]
    });

    head.addChild(leftEar);
    leftEar.setAnchorPoint([headSize[0] * 4 / 5, headSize[1] / 2, -headSize[2] / 2]);
    head.addChild(rightEar);
    rightEar.setAnchorPoint([-headSize[0] * 4 / 5, headSize[1] / 2, -headSize[2] / 2]);

    // Trunk
    const trunkSize: Vec3 = [0.5, 1.5, 0.5];
    const trunk: Cube[] = []
    const trunk1 = new Cube("Trunk1", {
        center: [0, -trunkSize[1] / 2, 0],
        size: trunkSize,
    });
    trunk1.setAnimationConfig({
        rotation: [
            { offset: 0, min: -45, max: 0 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    head.addChild(trunk1);
    trunk1.setAnchorPoint([0, 0, headSize[2] / 2]);
    trunk.push(trunk1);

    const trunk2 = new Cube("Trunk2", {
        center: [0, -trunkSize[1] / 2, 0],
        size: trunkSize,
    });
    trunk2.setAnimationConfig({
        rotation: [
            { offset: 0, min: -45, max: 0 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    trunk1.addChild(trunk2);
    trunk2.setAnchorPoint([0, -trunkSize[1], 0]);
    trunk.push(trunk2);

    const trunk3 = new Cube("Trunk3", {
        center: [0, -trunkSize[1] / 2, 0],
        size: trunkSize,
    });
    trunk3.setAnimationConfig({
        rotation: [
            { offset: 0, min: -45, max: 0 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });    
    
    trunk2.addChild(trunk3);
    trunk3.setAnchorPoint([0, -trunkSize[1], 0]);
    trunk.push(trunk3);

    // Leg
    const upperLegSize: Vec3 = [0.75, 3, 0.75];
    const bottomLegSize: Vec3 = [0.8, 1, 0.8];
    const leg: Cube[] = [];

    // Right Leg
    const rightFrontLeg1 = new Cube("rightFrontLeg1", {
        center: [0, -upperLegSize[1] / 2, 0],
        size: upperLegSize,
    });
    rightFrontLeg1.setAnimationConfig({
        rotation: [
            { offset: 0, min: 15, max: -15 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    body.addChild(rightFrontLeg1);
    rightFrontLeg1.setAnchorPoint([-bodySize[0] / 2 + upperLegSize[0] / 2, -bodySize[1] / 2 + 0.25, bodySize[2] / 2 - upperLegSize[2] / 2]);
    leg.push(rightFrontLeg1);

    const rightFrontLeg2 = new Cube("rightFrontLeg2", {
        center: [0, -bottomLegSize[1] / 2, 0],
        size: bottomLegSize,
    });
    rightFrontLeg2.setAnimationConfig({
        rotation: [
            { offset: 0, min: 0, max: 10 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    rightFrontLeg1.addChild(rightFrontLeg2);
    rightFrontLeg2.setAnchorPoint([0, -upperLegSize[1] + 0.25, 0]);
    leg.push(rightFrontLeg2);
    

    const rightBackLeg1 = new Cube("rightBackLeg1", {
        center: [0, -upperLegSize[1] / 2, 0],
        size: upperLegSize,
    });
    rightBackLeg1.setAnimationConfig({
        rotation: [
            { offset: 0, min: 15, max: -15 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    body.addChild(rightBackLeg1);
    rightBackLeg1.setAnchorPoint([-bodySize[0] / 2 + upperLegSize[0] / 2, -bodySize[1] / 2 + 0.25, -bodySize[2] / 2 + upperLegSize[2] / 2]);
    leg.push(rightBackLeg1);

    const rightBackLeg2 = new Cube("rightBackLeg2", {
        center: [0, -bottomLegSize[1] / 2, 0],
        size: bottomLegSize,
    });
    rightBackLeg2.setAnimationConfig({
        rotation: [
            { offset: 0, min: 0, max: 10 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    rightBackLeg1.addChild(rightBackLeg2);
    rightBackLeg2.setAnchorPoint([0, -upperLegSize[1] + 0.25, 0]);
    leg.push(rightBackLeg2);
    
    // Left Leg
    const leftFrontLeg1 = new Cube("leftFrontLeg1", {
        center: [0, -upperLegSize[1] / 2, 0],
        size: upperLegSize,
    });
    leftFrontLeg1.setAnimationConfig({
        rotation: [
            { offset: 0, min: -15, max: 15 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    body.addChild(leftFrontLeg1);
    leftFrontLeg1.setAnchorPoint([bodySize[0] / 2 - upperLegSize[0] / 2, -bodySize[1] / 2 + 0.25, bodySize[2] / 2 - upperLegSize[2] / 2]);
    leg.push(leftFrontLeg1);

    const leftFrontLeg2 = new Cube("leftFrontLeg2", {
        center: [0, -bottomLegSize[1] / 2, 0],
        size: bottomLegSize,
    });
    leftFrontLeg2.setAnimationConfig({
        rotation: [
            { offset: 0, min: 0, max: 10 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    leftFrontLeg1.addChild(leftFrontLeg2);
    leftFrontLeg2.setAnchorPoint([0, -upperLegSize[1] + 0.25, 0]);
    leg.push(leftFrontLeg2);
    

    const leftBackLeg1 = new Cube("leftBackLeg1", {
        center: [0, -upperLegSize[1] / 2, 0],
        size: upperLegSize,
    });
    leftBackLeg1.setAnimationConfig({
        rotation: [
            { offset: 0, min: -15, max: 15 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    body.addChild(leftBackLeg1);
    leftBackLeg1.setAnchorPoint([bodySize[0] / 2 - upperLegSize[0] / 2, -bodySize[1] / 2 + 0.25, -bodySize[2] / 2 + upperLegSize[2] / 2]);
    leg.push(leftBackLeg1);

    const leftBackLeg2 = new Cube("leftBackLeg2", {
        center: [0, -bottomLegSize[1] / 2, 0],
        size: bottomLegSize,
    });
    leftBackLeg2.setAnimationConfig({
        rotation: [
            { offset: 0, min: 0, max: 10 },
            DefaultSubConfig,
            DefaultSubConfig
        ]
    });

    leftBackLeg1.addChild(leftBackLeg2);
    leftBackLeg2.setAnchorPoint([0, -upperLegSize[1] + 0.25, 0]);
    leg.push(leftBackLeg2);

    // Tail
    const tailSize: Vec3 = [0.25, 1, 0.25];
    const tail: Cube[] = []
    const tail1 = new Cube("Tail1", {
        center: [0, -tailSize[1] / 2, 0],
        size: tailSize,
    });
    tail1.setAnimationConfig({
        rotation: [
            { offset: 15, min: 0, max: 0 },
            DefaultSubConfig,
            { offset: 0, min: -10, max: 20},
        ]
    });

    body.addChild(tail1);
    tail1.setAnchorPoint([0, 0, -bodySize[2] / 2 - tailSize[2] / 4]);
    tail.push(tail1);
    
    const tail2 = new Cube("Tail2", {
        center: [0, -tailSize[1] / 2, 0],
        size: tailSize,
    });
    tail2.setAnimationConfig({
        rotation: [
            DefaultSubConfig,
            DefaultSubConfig,
            { offset: 0, min: 10, max: -20},
        ]
    });

    tail1.addChild(tail2);
    tail2.setAnchorPoint([0, -tailSize[1], 0]);
    tail.push(tail2);


    shapes.push(body);
    shapes.push(neck);
    shapes.push(head);
    shapes.push(leftEar);
    shapes.push(rightEar);
    trunk.forEach((e) => shapes.push(e));
    leg.forEach((e) => shapes.push(e));
    tail.forEach((e) => shapes.push(e));
    // leftLegs.forEach((e) => shapes.push(e));
    // rightLegs.forEach((e) => shapes.push(e));
  }
}
