import { Cube } from "@/classes/Cube";
import { Model } from "@/classes/Models/Model";

export class HumanoidAngel extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;
    // const cube = new Cube("First Cube", {
    //   center: [0, 0, 0],
    //   size: [2, 2, 2],
    // });
    // const cube2 = new Cube("Second Cube");
    // const cube3 = new Cube("Third Cube");
    // const cube4 = new Cube("Fourth Cube");

    // cube.addChild(cube2);
    // cube2.addChild(cube3);
    // cube3.addChild(cube4);
    // cube2.setAnchorPoint([2, 2, 2]);
    // cube3.setAnchorPoint([2, 2, 2]);
    // cube4.setAnchorPoint([2, 2, 2]);
    // shapes.push(cube);
    // shapes.push(cube2);
    // shapes.push(cube3);
    // shapes.push(cube4);

    // console.log(cube.programInfo.uTranslation)
    // console.log(cube2.programInfo.uTranslation)
    // console.log(cube3.programInfo.uTranslation)
    // console.log(cube4.programInfo.uTranslation)
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

    // const leftArm = new Cube("Left-Arm", {
    //     center: [0, -1, 0],
    //     size: [0.5, 2, 0.5],
    // })
    // leftArm.setAnchorPoint([-1.1, 1, 0]);
    // body.addChild(leftArm);
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

    // const rightArm = new Cube("Right-Arm", {
    //     center: [0, -1, 0],
    //     size: [0.5, 2, 0.5],
    // })
    // rightArm.setAnchorPoint([1.1, 1, 0]);
    // body.addChild(rightArm);
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


    // const leftLeg = new Cube("Left-Leg", {
    //     center: [0, -1.35, 0],
    //     size: [0.6, 2.7, 0.5],
    // })
    // leftLeg.setAnchorPoint([-0.5, -1.1, 0]);
    // body.addChild(leftLeg);
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

    // const rightLeg = new Cube("Right-Leg", {
    //     center: [0, -1.35, 0],
    //     size: [0.6, 2.7, 0.5],
    // })
    // rightLeg.setAnchorPoint([0.5, -1.1, 0]);
    // body.addChild(rightLeg);
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
  }
}
