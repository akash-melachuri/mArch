import * as THREE from 'three';

var width = window.innerWidth;
var height = window.innerHeight;

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
        'SURF_DIST': '.01'
    },
    uniforms: {
        screen: { value: new THREE.Vector2(width, height) },
        clock: { value: clock.getElapsedTime() }
    }
});
const surface = new THREE.Mesh(geometry, material);
scene.add(surface);

function animate() {
    requestAnimationFrame(animate);

    surface.material.uniforms.clock.value += 0.1;

    renderer.render(scene, camera);
};

animate();
