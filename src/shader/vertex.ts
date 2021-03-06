const matrixSnippet = `
// https://github.com/glslify/glsl-inverse/blob/master/index.glsl
float inverse(float m) {
  return 1.0 / m;
}

mat2 inverse(mat2 m) {
  return mat2(m[1][1],-m[0][1],
             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}

mat3 inverse(mat3 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  float det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

// https://stackoverflow.com/questions/18034677/transpose-a-mat4-in-opengl-es-2-0-glsl
highp mat4 transpose(in highp mat4 inMatrix) {
  highp vec4 i0 = inMatrix[0];
  highp vec4 i1 = inMatrix[1];
  highp vec4 i2 = inMatrix[2];
  highp vec4 i3 = inMatrix[3];

  highp mat4 outMatrix = mat4(
               vec4(i0.x, i1.x, i2.x, i3.x),
               vec4(i0.y, i1.y, i2.y, i3.y),
               vec4(i0.z, i1.z, i2.z, i3.z),
               vec4(i0.w, i1.w, i2.w, i3.w)
               );
  return outMatrix;
}
`;

export const cubeVertexShader = `
  precision highp float;

  // vertex
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;

  // transformation
  uniform mat4 uTransformationMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;

  // lighting
  uniform vec3 uAmbientLight;
  uniform vec3 uDirectionalVector;
  uniform vec3 uDirectionalLightColor;

  varying vec4 vColor;
  varying vec3 vLighting;

  attribute  vec2 vTexCoord;
  varying vec2 fTexCoord;
  uniform vec3 uWorldCamPos;

  ${matrixSnippet}

  void main() {
    vColor = aVertexColor;

    gl_Position = uProjectionMatrix * uViewMatrix * uTransformationMatrix *  vec4(aVertexPosition, 1);    

    // lighting
    vec4 transformedNormal = transpose(inverse(uTransformationMatrix)) * vec4(aVertexNormal, 1);
    vec3 directionalVector = normalize(uDirectionalVector);
    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = uAmbientLight + (uDirectionalLightColor * directional);
  }
`;

export const textureCubeVertexShader = `
  precision highp float;

  // vertex
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;

  // transformation
  uniform mat4 uTransformationMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;

  // lighting
  uniform vec3 uAmbientLight;
  uniform vec3 uDirectionalVector;
  uniform vec3 uDirectionalLightColor;

  varying vec4 vColor;
  varying vec3 vLighting;

  attribute  vec2 vTexCoord;
  varying vec2 fTexCoord;
  uniform vec3 uWorldCamPos;

  ${matrixSnippet}

  void main() {
    fTexCoord = vTexCoord;
    vColor = aVertexColor;

    gl_Position = uProjectionMatrix * uViewMatrix * uTransformationMatrix *  vec4(aVertexPosition, 1);    

    // lighting
    vec4 transformedNormal = transpose(inverse(uTransformationMatrix)) * vec4(aVertexNormal, 1);
    vec3 directionalVector = normalize(uDirectionalVector);
    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = uAmbientLight + (uDirectionalLightColor * directional);
  }
`;

export const environmentCubeVertexShader = `
  precision highp float;

  // vertex
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;

  // transformation
  uniform mat4 uTransformationMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;

  // lighting
  uniform vec3 uAmbientLight;
  uniform vec3 uDirectionalVector;
  uniform vec3 uDirectionalLightColor;

  varying vec4 vColor;
  varying vec3 vLighting;

  attribute vec2 vTexCoord;
  varying vec2 fTexCoord;
  uniform vec3 uWorldCamPos;

  varying vec3 R;
  
  ${matrixSnippet}

  void main() {
    fTexCoord = vTexCoord;
    vColor = aVertexColor;

    // env mapping
    vec3 worldPos = (uTransformationMatrix * vec4(aVertexPosition, 1)).xyz;
    vec3 worldNormal = normalize(mat3(uTransformationMatrix) * aVertexNormal);
    vec3 worldCamPos = uWorldCamPos;
    vec3 eyeToSurfaceDir = normalize(worldCamPos - worldPos);
    R = reflect(eyeToSurfaceDir, worldNormal);
    //======================
    gl_Position = uProjectionMatrix * uViewMatrix * uTransformationMatrix *  vec4(aVertexPosition, 1);    

    // lighting
    vec4 transformedNormal = transpose(inverse(uTransformationMatrix)) * vec4(aVertexNormal, 1);
    vec3 directionalVector = normalize(uDirectionalVector);
    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = uAmbientLight + (uDirectionalLightColor * directional);
  }
`;

export const bumpCubeVertexShader = `
  precision highp int;
  precision highp float;

  // vertex
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;

  // transformation
  uniform mat4 uTransformationMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;

  // lighting
  uniform vec3 uAmbientLight;
  uniform vec3 uDirectionalVector;
  uniform vec3 uDirectionalLightColor;

  varying vec4 vColor;
  varying vec3 vLighting;

  attribute vec2 vTexCoord;
  varying vec2 fTexCoord;
  uniform vec3 uWorldCamPos;

  attribute vec2 a_Texture_coordinate;

  attribute vec3 a_P2;
  attribute vec3 a_P3;
  attribute vec2 a_Uv2;
  attribute vec2 a_Uv3;

  varying vec3 v_Vertex;
  varying vec3 v_Normal;

  varying vec2 v_Texture_coordinate;

  varying vec3 v_U3d;
  varying vec3 v_V3d;

  void calulate_triangle_coordinate_system(vec3 p1,  vec3 p2,  vec3 p3,
                                          vec2 uv1, vec2 uv2, vec2 uv3) {
    float u1 = uv1[0];
    float v1 = uv1[1];
    float u2 = uv2[0];
    float v2 = uv2[1];
    float u3 = uv3[0];
    float v3 = uv3[1];

    float divisor = (u3-u1)*(v2-v1) - (u2-u1)*(v3-v1);

    v_U3d = ((v2-v1)*(p3-p1) - (v3-v1)*(p2-p1)) /  divisor;
    v_V3d = ((u2-u1)*(p3-p1) - (u3-u1)*(p2-p1)) / -divisor;

    normalize(v_U3d);
    normalize(v_V3d);
  }

  void main() {
    calulate_triangle_coordinate_system(aVertexPosition, a_P2, a_P3, a_Texture_coordinate, a_Uv2, a_Uv3);
    v_Vertex = vec3( uTransformationMatrix * vec4(aVertexPosition, 1.0) );
    v_Normal = vec3( uTransformationMatrix * vec4(aVertexNormal, 0.0) );
    v_U3d = vec3( uTransformationMatrix * vec4(v_U3d, 0.0) );
    v_V3d = vec3( uTransformationMatrix * vec4(v_V3d, 0.0) );
    v_Texture_coordinate = a_Texture_coordinate;
    gl_Position = uProjectionMatrix * uViewMatrix * uTransformationMatrix* vec4(aVertexPosition, 1.0);
  }
`;

export const vertexShaders: string[] = [
  cubeVertexShader,
  textureCubeVertexShader,
  environmentCubeVertexShader,
  bumpCubeVertexShader,
];
