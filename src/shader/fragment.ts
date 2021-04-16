const variables = `
precision highp float;
  
varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vLighting;

uniform bool uLightingOn;
`;

export const cubeFragmentShader = `
  ${variables}
  void main() {
    // float xy = min( abs(vPosition.x), abs(vPosition.y));
    // float xz = min( abs(vPosition.x), abs(vPosition.z));
    // float yz = min( abs(vPosition.y), abs(vPosition.z));
    // float b1 = 0.74;
    // float b2 = 0.76;
    // float b3 = 0.98;
    // if ((xy < b1) && (xz < b1) && (yz < b1))
    //     discard;
    // else if ((xy < b2) && (xz < b2) && (yz < b2))
    //     gl_FragColor = vec4(0, 0, 0, 1);
    // else if ((xy > b3) || (xz > b3) || (yz > b3))
    //     gl_FragColor = vec4(0, 0, 0, 1);
    // else {
        gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
    // }
  }
`;

export const prismFragmentShader = `
    ${variables}
    const float EPS = 0.001;
    const float xNorm = 0.0;
    const float yNorm = -sqrt(2.0) / 2.0;
    const float zNorm = sqrt(2.0) / 2.0;
    vec3 p[4];

    float planeRes(vec3 pos) {
        float ret = xNorm * (pos.x - p[0].x) + yNorm * (pos.y - p[0].y) + zNorm * (pos.z - p[0].z);
        return ret;
    }
    
    bool onPlane(vec3 pos) {
        return abs(planeRes(pos)) < EPS;
    }

    float distToPlane(vec3 pos) {
        return abs(planeRes(pos)) / sqrt(xNorm * xNorm + yNorm * yNorm + zNorm * zNorm);
    }

    // p0 titik, p1, p2 garis
    float distanceToLine(vec3 p0, vec3 p1, vec3 p2) {
        vec3 d = (p2 - p1) / distance(p2, p1);
        vec3 v = p0 - p1;
        float t = dot(v, d);
        vec3 P = p1 + t * d;
        return distance(P, p0);
    }

    float minDistanceToBorder(vec3 pos) {
        float mn = 1e4;
        for (int i = 0; i < 4; i++) {
            mn = min(mn, distanceToLine(pos, p[i], p[i + 1 == 4 ? 0 : i + 1]));
        }
        return mn;
    }

    void main() {
        p[0] = vec3(1, 1, 1);
        p[1] = vec3(-1, 1, 1);
        p[2] = vec3(-1, -1, -1);
        p[3] = vec3(1, -1, -1);

        float xy = min( abs(vPosition.x), abs(vPosition.y));
        float xz = min( abs(vPosition.x), abs(vPosition.z));
        float yz = min( abs(vPosition.y), abs(vPosition.z));
        float b1 = 0.74;
        float b2 = 0.76;
        float b3 = 0.98;
        if (onPlane(vPosition)) {
            float dist = minDistanceToBorder(vPosition);
            dist = 1.0 - dist;
            if (dist < b1) {
                discard;
            } else {
                if (dist < b2 || dist > b3) {
                    gl_FragColor = vec4(0, 0, 0, 1);
                } else {
                    gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
                }
            }
            return;
        }

        float dist = distToPlane(vPosition);
        if (dist < (1.0 - b1)) {
            if (dist > (1.0 - b2) || dist < (1.0 - b3)) {
                gl_FragColor = vec4(0, 0, 0, 1);
            } else {
                gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
            }
            return;
        }

        if ((xy < b1) && (xz < b1) && (yz < b1))
            discard;
        else if ((xy < b2) && (xz < b2) && (yz < b2))
            gl_FragColor = vec4(0, 0, 0, 1);
        else if ((xy > b3) || (xz > b3) || (yz > b3))
            gl_FragColor = vec4(0, 0, 0, 1);
        else {
            gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
        }
    }
`;

export const torusFragmentShader = `
    ${variables}

	void main(void) {
        gl_FragColor = uLightingOn ? vec4(vec3(vColor) * vLighting, 1.0) : vColor;
	}
`;
