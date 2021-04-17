const canvas = document.getElementById("gl-display") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if (!canvas) {
  alert("Canvas not found");
}

if (!gl) {
  alert("Your browser does not support WebGL");
}

export { canvas, gl };
