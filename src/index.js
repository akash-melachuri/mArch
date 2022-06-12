import * as THREE from 'three';

var width = window.innerWidth;
var height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
camera.position.z = 1;

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(width, height)

const geometry = new THREE.PlaneGeometry(width, height);
const material = new THREE.ShaderMaterial({
    vertexShader: require('./vert.glsl'),
    fragmentShader: require('./frag.glsl'),
});
const surface = new THREE.Mesh(geometry, material);
scene.add(surface);


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();
