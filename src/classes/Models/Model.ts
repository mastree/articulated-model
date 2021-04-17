import Shape from "../Shape";

export abstract class Model {
  public shapes: Shape[] = [];
  constructor(public name: string) {
    // naon euy
  }

  abstract createModel(): void;
}
