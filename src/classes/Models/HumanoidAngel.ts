import { Cube } from "@/classes/Cube";
import { Wing } from "@/classes/Wing";
import { Model } from "@/classes/Models/Model";
import { degToRad, vDegToRad } from "@/utils/rotate-utils";
import { DefaultSubConfig } from "@/utils/animate-utils";

export class HumanoidAngel extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;

    // BODY PARTS CREATION
    // Create Body
    const body = new Cube("Body", {
        center: [0, 0, 0],
        size: [1.5, 2, 0.5],
    })

    // Create Head
    const head = new Cube("Head", {
        center: [0, 0.5, 0],
        size: [1, 1, 1],
    })
    head.setAnchorPoint([0, 1.1, 0]);
    body.addChild(head);
    
    // Create Left-Arm
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

    // Create Right-Arm
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

    // Create Left-Leg
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

    // Create Right-Leg
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

    // Create Wings
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


    // ADD ANIMATION
    // Body Animation
    body.setAnimationConfig({
        rotation: [
            {offset: 10, min: 0, max: 0},
            DefaultSubConfig,
            DefaultSubConfig,
        ],
    });

    // Body Animation
    head.setAnimationConfig({
        rotation: [
            DefaultSubConfig,
            {offset: 0, min: -4, max: 4},
            DefaultSubConfig,
        ],
    });
    head.setAnimationSpeed(0.75);
    
    // Left-Arm Animation
    upperLeftArm.setAnimationConfig({
        rotation: [
            {offset: 0, min: 55, max: -30},
            {offset: 0, min: 0, max: 50},
            DefaultSubConfig,
        ],
    });
    upperLeftArm.setAnimationSpeed(0.75);
    lowerLeftArm.setAnimationConfig({
        rotation: [
            {offset: 5, min: -60, max: -130},
            DefaultSubConfig,
            DefaultSubConfig,
        ],
    });
    lowerLeftArm.setAnimationSpeed(0.75);
    
    // Right-Arm Animation
    upperRightArm.setAnimationConfig({
        rotation: [
            {offset: 0, min: -30, max: 55},
            {offset: 0, min: -50, max: 0},
            DefaultSubConfig,
        ],
    });
    upperRightArm.setAnimationSpeed(0.75);
    lowerRightArm.setAnimationConfig({
        rotation: [
            {offset: 5, min: -130, max: -60},
            DefaultSubConfig,
            DefaultSubConfig,
        ],
    });
    lowerRightArm.setAnimationSpeed(0.75);
    
    // Left-Leg Animation
    upperLeftLeg.setAnimationConfig({
        rotation: [
            {offset: -10, min: -45, max: 30},
            {offset: 0, min: -10, max: 0},
            DefaultSubConfig,
        ],
    });
    upperLeftLeg.setAnimationSpeed(0.75);
    lowerLeftLeg.setAnimationConfig({
        rotation: [
            {offset: 5, min: 0, max: 90},
            DefaultSubConfig,
            DefaultSubConfig,
        ],
    });
    lowerLeftLeg.setAnimationSpeed(0.75);

    // Right-Leg Animation
    upperRightLeg.setAnimationConfig({
        rotation: [
            {offset: -10, min: 30, max: -45},
            {offset: 0, min: 0, max: 10},
            DefaultSubConfig,
        ],
    });
    upperRightLeg.setAnimationSpeed(0.75);
    lowerRightLeg.setAnimationConfig({
        rotation: [
            {offset: 5, min: 90, max: 0},
            DefaultSubConfig,
            DefaultSubConfig,
        ],
    });
    lowerRightLeg.setAnimationSpeed(0.75);
    
    // Wings Animation
    leftWing.setAnimationConfig({
        rotation: [
            DefaultSubConfig,
            {offset: 0, min: -40, max: 40},
            DefaultSubConfig,
        ],
    });
    leftWing.setAnimationSpeed(2);
    rightWing.setAnimationConfig({
        rotation: [
            DefaultSubConfig,
            {offset: 0, min: 40, max: -40},
            DefaultSubConfig,
        ],
    });
    rightWing.setAnimationSpeed(2);

    // Shapes push parts
    shapes.push(body);
    shapes.push(head);
    shapes.push(upperLeftArm);
    shapes.push(lowerLeftArm);
    shapes.push(upperRightArm);
    shapes.push(lowerRightArm);
    shapes.push(upperLeftLeg);
    shapes.push(lowerLeftLeg);
    shapes.push(upperRightLeg);
    shapes.push(lowerRightLeg);
    shapes.push(leftWing);
    shapes.push(rightWing);
  }
}
