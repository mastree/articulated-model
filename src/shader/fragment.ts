const variables = `
precision highp float;
  
varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vLighting;

uniform bool uLightingOn;
`;

export const cubeFragmentShader = `
  ${variables}
  varying vec2 fTexCoord;
  uniform sampler2D texture;
  
  void main() {
    vec4 texCol = texture2D( texture, fTexCoord );
    vec4 curCol = vColor * texCol;
    // vec4 curCol = vColor;
    gl_FragColor = uLightingOn ? vec4(vec3(curCol) * vLighting, 1.0) : curCol;
  }
`;
