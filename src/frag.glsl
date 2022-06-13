varying vec2 vUv;

uniform vec2 screen;
uniform float clock;

struct Camera {
    vec3 position;
    mat4 rotation;
};

uniform Camera cam;

uniform float power;

float sphere_dist(vec3 p, vec4 sphere) {
    return length(p - sphere.xyz) - sphere.w;
}

float plane_dist(vec3 p) {
    return p.y;
}

/* Blatanly stolen from: */
/* http://blog.hvidtfeldts.net/index.php/2011/09/distance-estimated-3d-fractals-v-the-mandelbulb-different-de-approximations/ */
vec2 mandlebulb_dist(vec3 p) {
	vec3 z = p;
	float dr = 1.0;
	float r = 0.0;
    int i;
	for (i = 0; i < 15; i++) {
		r = length(z);
		if (r>MAX_DIST) break;
		
		// convert to polar coordinates
		float theta = acos(z.z/r);
		float phi = atan(z.y,z.x);
		dr =  pow( r, power - 1.)*power*dr + 1.;
		
		// scale and rotate the point
		float zr = pow( r,power);
		theta = theta*power;
		phi = phi*power;
		
		// convert back to cartesian coordinates
		z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
		z+=p;
	}
	return vec2(0.5*log(r)*r/dr, i);
}

float dist(vec3 p) {
    /* vec4 sphere = vec4(0, 1, 6, 1); */

    /* float d = min(sphere_dist(p, sphere), plane_dist(p)); */

    return mandlebulb_dist(p).x;
}

float march(vec3 ro, vec3 rd) {
    float dO = 0.;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = dist(p);
        dO += dS;

        if (dO > MAX_DIST || dS < SURF_DIST) break;
    }

    return dO;
}

vec3 get_normal(vec3 p) {
    float d = dist(p);

    vec2 e = vec2(.01, 0.);

    vec3 n = d - vec3(
            dist(p - e.xyy),
            dist(p - e.yxy),
            dist(p - e.yyx)
            );

    return normalize(n);
}

float get_light(vec3 p) {
    vec3 light_pos = cam.position;
    vec3 l = normalize(light_pos - p);
    vec3 n = get_normal(p);

    float dif = dot(n, l);
    return dif;
}

void main() {
    vec2 uv = (vUv - .5) * (screen.xy / screen.y);
    vec3 col = vec3(1.);

    vec3 ro = cam.position;
    vec3 rd = normalize(mat3(cam.rotation) * vec3(uv.x, uv.y, 1.));

    float d = march(ro, rd);

    vec3 p = ro + rd * d;

    float dif = get_light(p);
    col = vec3(dif);

    gl_FragColor = vec4(col.x * .5, 0.0, col.z * .8, 0.);
}
