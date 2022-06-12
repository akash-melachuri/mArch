varying vec2 vUv;

uniform vec2 screen;
uniform float clock;

float sphere_dist(vec3 p, vec4 sphere) {
    return length(p - sphere.xyz) - sphere.w;
}

float plane_dist(vec3 p) {
    return p.y;
}

float dist(vec3 p) {
    vec4 sphere = vec4(0, 1, 6, 1);

    float d = min(sphere_dist(p, sphere), plane_dist(p));

    return d;
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
    vec3 light_pos = vec3(0., 5., 6.);
    light_pos.xz += vec2(sin(clock), cos(clock));
    vec3 l = normalize(light_pos - p);
    vec3 n = get_normal(p);

    float dif = dot(n, l);
    return dif;
}

void main() {
    vec2 uv = (vUv - .5) * (screen.xy / screen.y);
    vec3 col = vec3(1.);

    vec3 ro = vec3(0., 1., 0.);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1.));

    float d = march(ro, rd);

    vec3 p = ro + rd * d;

    float dif = get_light(p);
    col = vec3(dif);

    gl_FragColor = vec4(col, 1.);
}
