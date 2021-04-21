const variables = `
precision highp float;
  
varying vec4 vColor;
varying vec3 vLighting;
varying vec3 R;

uniform bool uLightingOn;
`;

export const cubeFragmentShader = `
  precision highp float;
      
  varying vec4 vColor;
  varying vec3 vLighting;

  uniform bool uLightingOn;

  void main() {
    gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
  }
`;

export const textureFragmentShader = `
  precision highp float;
    
  varying vec4 vColor;
  varying vec3 vLighting;

  uniform bool uLightingOn;

  varying vec2 fTexCoord;
  uniform sampler2D texture;
  
  void main() {
    vec4 texCol = texture2D( texture, fTexCoord );
    vec4 curCol = vColor * texCol;
    // vec4 curCol = vColor;
    gl_FragColor = uLightingOn ? vec4(vec3(curCol) * vLighting, 1.0) : curCol;
  }
`;

export const environmentFragmentShader = `
  precision highp float;
    
  varying vec4 vColor;
  varying vec3 vLighting;
  varying vec3 R;

  uniform bool uLightingOn;

  varying vec2 fTexCoord;
  uniform samplerCube texture;
  
  void main() {
    vec4 curCol = textureCube(texture, R);
    gl_FragColor = uLightingOn ? vec4(vec3(curCol) * vLighting, 1.0) : curCol;
  }
`;
