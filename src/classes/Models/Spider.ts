import { Cube } from "@/classes/Cube";
import { Wing } from "@/classes/Wing";
import { Model } from "@/classes/Models/Model";
import { degToRad, vDegToRad } from "@/utils/rotate-utils";
import { DefaultSubConfig } from "@/utils/animate-utils";

export class Spider extends Model {
  constructor(name: string) {
    super(name);
    this.createModel();
  }

  createModel() {
    const { shapes } = this;
    const headSize: Vec3 = [1.2, 1.2, 1.2];
    const head = new Cube("Head", {
      center: [0, 0, 0],
      size: headSize,
    });
    head.setAnimationConfig({
      rotation: [
        { offset: 0, min: -10, max: 10 },
        DefaultSubConfig,
        DefaultSubConfig,
      ],
    });
    const neckSize: Vec3 = [1, 1, 1];
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
    const bodySize: Vec3 = [2, 2, 3.5];
    const body = new Cube("Body", {
      center: [0, 0, 0],
      size: bodySize,
    });
    const leftLegs: Cube[] = [];
    const legSize: Vec3 = [3, 0.5, 0.5];
    for (let i = 1; i <= 4; i++) {
      const curLeg: Cube = new Cube(`Left-Leg-${i}`, {
        center: [0, 0, 0],
        size: legSize,
      });
      leftLegs.push(curLeg);
      body.addChild(curLeg);
      body.setAnimationConfig({
        rotation: [
          DefaultSubConfig,
          { offset: -60, min: 0, max: 0 },
          DefaultSubConfig,
        ],
      });
      curLeg.setAnchorPoint([
        bodySize[0] / 2 + legSize[0] / 2 - 0.5,
        -1,
        i - 2,
      ]);
      curLeg.rotate(vDegToRad([0, (i - 2) * -30, -15]));
      curLeg.setAnimationConfig({
        rotation: [
          DefaultSubConfig,
          DefaultSubConfig,
          {
            offset: 0,
            min: i % 2 == 0 ? 10 : -10,
            max: i % 2 == 0 ? -10 : 10,
          },
        ],
      });
      curLeg.setAnimationSpeed(0.7);
    }
    const rightLegs: Cube[] = [];
    for (let i = 1; i <= 4; i++) {
      const curLeg: Cube = new Cube(`Right-Leg-${i}`, {
        center: [0, 0, 0],
        size: legSize,
      });
      rightLegs.push(curLeg);
      body.addChild(curLeg);
      curLeg.setAnchorPoint([
        -(bodySize[0] / 2 + legSize[0] / 2 - 0.5),
        -1,
        i - 2,
      ]);
      curLeg.rotate(vDegToRad([0, (i - 2) * 30, 15]));
      curLeg.setAnimationConfig({
        rotation: [
          DefaultSubConfig,
          DefaultSubConfig,
          {
            offset: 0,
            min: i % 2 == 0 ? -10 : 10,
            max: i % 2 == 0 ? 10 : -10,
          },
        ],
      });
      curLeg.setAnimationSpeed(0.7);
    }
    body.setRotate(vDegToRad([0, -60, 0]));
    body.addChild(neck);
    body.setAnimationConfig({
      rotation: [
        { offset: 20, min: 0, max: 0 },
        { offset: 0, min: -160, max: 160 },
        { offset: 10, min: 0, max: 0 },
      ],
    });
    body.setAnimationSpeed(0.03);
    neck.setAnchorPoint([0, -0.25, bodySize[2] / 2 + neckSize[2] / 2]);
    neck.addChild(head);
    head.setAnchorPoint([0, 0, neckSize[2] / 2 + headSize[2] / 2 - 0.5]);

    shapes.push(body);
    shapes.push(neck);
    shapes.push(head);
    leftLegs.forEach((e) => shapes.push(e));
    rightLegs.forEach((e) => shapes.push(e));
  }
}
