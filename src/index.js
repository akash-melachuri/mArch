import * as THREE from 'three';
import { Matrix3 } from 'three';

var width = window.innerWidth;
var height = window.innerHeight;

var radius = 3.;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
camera.position.z = 1;

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(width, height)

const clock = new THREE.Clock(true);

const geometry = new THREE.PlaneGeometry(width, height);
const material = new THREE.ShaderMaterial({
    vertexShader: require('./vert.glsl'),
    fragmentShader: require('./frag.glsl'),
    defines: {
        'MAX_STEPS': '100',
        'MAX_DIST': '100.',
        'SURF_DIST': '.01',
    },
    uniforms: {
        screen: { value: new THREE.Vector2(width, height) },
        clock: { value: clock.getElapsedTime() },
        cam: {
            value: {
                position: new THREE.Vector3(0., 0., -radius),
                rotation: new THREE.Matrix4() 
            }
        },
        power: { value: 8. }
    }
});
const surface = new THREE.Mesh(geometry, material);
scene.add(surface);

var yaw = 0;
var pitch = 0;

function animate() {
    requestAnimationFrame(animate);

    surface.material.uniforms.clock.value += 0.01;
    surface.material.uniforms.cam.value.rotation.makeRotationY(pitch);
    surface.material.uniforms.cam.value.position = new THREE.Vector3(radius * Math.sin(yaw), 0., -radius * Math.cos(yaw));
    surface.material.uniforms.power.value = Math.sin(surface.material.uniforms.clock.value) * 2. + 8.;

    yaw += .01;
    pitch -= .01;

    renderer.render(scene, camera);
};

animate();
