import { Cube } from "@/classes/Cube";
import { Wing } from "@/classes/Wing";
import { Model } from "@/classes/Models/Model";
import { degToRad } from "@/utils/rotate-utils";

export class HumanoidAngel extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;
    const body = new Cube("Body", {
        center: [0, 0, 0],
        size: [1.5, 2, 0.5],
    })
    const head = new Cube("Head", {
        center: [0, 0.5, 0],
        size: [1, 1, 1],
    })
    head.setAnchorPoint([0, 1.1, 0]);
    body.addChild(head);

    const upperLeftArm = new Cube("Upper-Left-Arm", {
        center: [0, -0.6, 0],
        size: [0.5, 1.2, 0.5],
    })
    upperLeftArm.setAnchorPoint([-1.1, 1, 0]);
    body.addChild(upperLeftArm);

    const lowerLeftArm = new Cube("Lower-Left-Arm", {
        center: [0, -0.6, 0],
        size: [0.5, 1.2, 0.5],
    })
    lowerLeftArm.setAnchorPoint([0, -1.2, 0]);
    upperLeftArm.addChild(lowerLeftArm);

    const upperRightArm = new Cube("Upper-Right-Arm", {
        center: [0, -0.6, 0],
        size: [0.5, 1.2, 0.5],
    })
    upperRightArm.setAnchorPoint([1.1, 1, 0]);
    body.addChild(upperRightArm);

    const lowerRightArm = new Cube("Lower-Right-Arm", {
        center: [0, -0.6, 0],
        size: [0.5, 1.2, 0.5],
    })
    lowerRightArm.setAnchorPoint([0, -1.2, 0]);
    upperRightArm.addChild(lowerRightArm);

    const upperLeftLeg = new Cube("Upper-Left-Leg", {
        center: [0, -0.75, 0],
        size: [0.6, 1.5, 0.5],
    })
    upperLeftLeg.setAnchorPoint([-0.5, -1.1, 0]);
    body.addChild(upperLeftLeg);

    const lowerLeftLeg = new Cube("Lower-Left-Leg", {
        center: [0, -0.75, 0],
        size: [0.6, 1.5, 0.5],
    })
    lowerLeftLeg.setAnchorPoint([0, -1.5, 0]);
    upperLeftLeg.addChild(lowerLeftLeg);

    const upperRightLeg = new Cube("Upper-Right-Leg", {
        center: [0, -0.75, 0],
        size: [0.6, 1.5, 0.5],
    })
    upperRightLeg.setAnchorPoint([0.5, -1.1, 0]);
    body.addChild(upperRightLeg);

    const lowerRightLeg = new Cube("Lower-Right-Leg", {
        center: [0, -0.75, 0],
        size: [0.6, 1.5, 0.5],
    })
    lowerRightLeg.setAnchorPoint([0, -1.5, 0]);
    upperRightLeg.addChild(lowerRightLeg);

    const leftWing = new Wing("Left-Wing", false, {
        center: [-1.5, 0.75, 0],
        size: [3, 1.5, 0.2],
    })
    leftWing.setAnchorPoint([-0.35, 0.8, -0.5]);
    leftWing.rotate([degToRad(-3), degToRad(-66), degToRad(73)]);
    body.addChild(leftWing);

    const rightWing = new Wing("Right-Wing", true, {
        center: [1.5, 0.75, 0],
        size: [3, 1.5, 0.2],
    })
    rightWing.setAnchorPoint([0.35, 0.8, -0.5]);
    rightWing.rotate([degToRad(-3), degToRad(66), degToRad(-73)]);
    body.addChild(rightWing);

    shapes.push(body);
    shapes.push(head);

    // arms
    shapes.push(upperLeftArm);
    shapes.push(lowerLeftArm);
    shapes.push(upperRightArm);
    shapes.push(lowerRightArm);

    // legs
    shapes.push(upperLeftLeg);
    shapes.push(lowerLeftLeg)
    shapes.push(upperRightLeg);
    shapes.push(lowerRightLeg);

    // wings
    shapes.push(leftWing);
    shapes.push(rightWing);
  }
}
