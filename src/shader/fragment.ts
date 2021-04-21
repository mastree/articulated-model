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

export const bumpFragmentShader = `
  precision highp float;

  // from runestone
  varying vec3 v_Vertex;
  varying vec3 v_Normal;
  varying vec3 v_U3d, v_V3d;
  varying vec2 v_Texture_coordinate;

  uniform vec3 u_Light_position;
  uniform vec3 u_Light_color;
  uniform vec3 u_Ambient_intensities;
  uniform vec2 u_Image_size;
  uniform float u_Shininess;
  // end of runestone

  varying vec4 vColor;
  varying vec3 vLighting;

  uniform bool uLightingOn;
  
  uniform sampler2D uSampler;
  uniform sampler2D uBumpSampler;
  uniform bool uLightingOn;

  vec2 get_normal_offsets(vec2 texture_coordinates){
    float pixel_delta_u=1./u_Image_size[0];
    float pixel_delta_v=1./u_Image_size[1];

    vec2 up=vec2(0.,pixel_delta_v);
    vec2 down=vec2(0.,-pixel_delta_v);
    vec2 left=vec2(-pixel_delta_u,0.);
    vec2 right=vec2(pixel_delta_u,0.);

    vec4 right_color=texture2D(uBumpSampler,texture_coordinates+right);
    vec4 left_color=texture2D(uBumpSampler,texture_coordinates+left);
    vec4 up_color=texture2D(uBumpSampler,texture_coordinates+up);
    vec4 down_color=texture2D(uBumpSampler,texture_coordinates+down);

    return vec2(right_color[0]-left_color[0],up_color[0]-down_color[0]);
  }

  vec3 bump_map_normal(vec3 normal,vec2 texture_coordinates){
    vec2 offsets=get_normal_offsets(texture_coordinates);
    normal=normal+offsets[0]*v_U3d+offsets[1]*v_V3d;
    return normalize(normal);
  }

  vec3 light_calculations(vec3 fragment_color,
                          vec3 fragment_normal,
                          vec3 light_position,
                          vec3 light_color) {

    vec3 to_light = light_position - v_Vertex;
    to_light = normalize( to_light );

    float cos_angle = dot(fragment_normal, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);

    vec3 diffuse_color = vec3(fragment_color) * light_color * cos_angle;

    vec3 reflection = 2.0 * dot(fragment_normal,to_light) * fragment_normal - to_light;
    reflection = normalize( reflection );

    vec3 to_camera = -1.0 * v_Vertex;
    to_camera = normalize( to_camera );

    cos_angle = dot(reflection, to_camera);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    cos_angle = pow(cos_angle, u_Shininess);

    vec3 specular_color = light_color * cos_angle;

    vec3 color = diffuse_color + specular_color;
    color = clamp(color, 0.0, 1.0);

    return color;
  }

  void main() {
    if (uLightingOn) {
      vec3 normal = bump_map_normal(v_Normal, v_Texture_coordinate);
      vec4 v_Color = texture2D(uSampler, v_Texture_coordinate);
      vec3 color = light_calculations(vec3(v_Color), normal, u_Light_position, u_Light_color);
      color = color + u_Ambient_intensities * vec3(v_Color);
      gl_FragColor = vec4(color, v_Color.a);
    } else {
      gl_FragColor = texture2D(uSampler, v_Texture_coordinate);
    }
  }
`;
