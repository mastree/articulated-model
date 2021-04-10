import { torusVertexShader } from "../shader/vertex";
import { torusFragmentShader } from "../shader/fragment";
import { TorusDefault } from "../constant";

import Shape from "./Shape";
import vector from "../utils/vector-utils";

//  prettier-ignore
export default class Torus extends Shape {
	// indexBuffer: WebGLBuffer | null;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    super(canvas, gl, torusVertexShader, torusFragmentShader);
		
		// this.programInfo.optionalAttribute? = {}
		
		const torus = this.makeTorus(0.6, 0.2, 40, 40, 1);
    this.programInfo.aVertexPosition.value = torus.vertices;
		this.programInfo.aVertexColor.value = torus.colors;
		this.programInfo.aVertexNormal.value = torus.normals;
		this.loadDefaults();
	}

	loadDefaults() {
		this.programInfo.uTranslation.value = TorusDefault.uTranslation
		this.programInfo.uScale.value = TorusDefault.uScale
		this.programInfo.uRotation.value = TorusDefault.uRotation
	}
	
  render() {
    const {gl, program} = this;
    this.persistVars();

		gl.useProgram(program);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.programInfo.aVertexPosition.value.length/3);
    return;
  }

  makeTorus(rad: number, secRad: number, num: number, secNum: number, k: number){
    const tv: number[] = [];
    const tc: number[] = [];
    const normals: number[] = [];

    //  Iterates along the big circle and then around a section
    for(let i = 0; i < num; i++)               //  Iterates over all strip rounds
			for(let j = 0; j < secNum + (i == num - 1? 1 : 0); j++) //  Iterates along the torus section
				for(let v = 0; v < 2; v++)           //  Creates zigzag pattern (v equals 0 or 1)
				{
					//  Pre-calculation of angles
					let a =  2 * Math.PI  *  (i + j / secNum + k * v) / num;
					let sa = 2 * Math.PI * j / secNum;
					let x, y, z;

					//  Coordinates on the surface of the torus
					tv.push(x = (rad + secRad * Math.cos(sa)) * Math.cos(a));
					tv.push(y = (rad + secRad * Math.cos(sa)) * Math.sin(a));
					tv.push(z = secRad * Math.sin(sa));

					//  Colors
					tc.push(0.5 + 0.5 * x);
					tc.push(0.5 + 0.5 * y);
					tc.push(0.5 + 0.5 * z);
					tc.push(1.0);
				}

		const pointNum = tv.length / 3;

		for(let i = 0; i < pointNum * 3 - 6; i += 3) {
			// if(i + 9 > pointNum * 3) continue;
			const normal = vector.normal(
				tv[i], tv[i + 1], tv[i + 2],
				tv[i + 3], tv[i + 4], tv[i + 5], 
				tv[i + 6], tv[i + 7], tv[i + 8]
			);

			normals.push(normal.x);
			normals.push(normal.y);
			normals.push(normal.z);
		}

			return {vertices: tv, colors: tc, normals};
    }
}
