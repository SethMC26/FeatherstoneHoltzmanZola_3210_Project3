import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';
import { Card } from './Card';
import { Deck } from './Deck';
import { Game } from './game';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
let game;

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 3000);
camera.position.set(0, 30, 70)
camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Create table and floor before loading GLTF

// const table = new Table(16);
// table.tableGroup.traverse((object) => {
//     if (object.isMesh) {
//         object.castShadow = true;
//     }
// });
// scene.add(table.tableGroup);

// const floor = new Floor(16);
// floor.mesh.receiveShadow = true;
// scene.add(floor.mesh);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xf59a40, 1);
scene.add(ambientLight);
let ambientLightOn = true;

const tableLight = new THREE.PointLight(0xFFFFFF, 10000);
tableLight.position.set(0, 30, 0);
tableLight.castShadow = true;
tableLight.shadow.mapSize.width = 2048;
tableLight.shadow.mapSize.height = 2048;
tableLight.shadow.camera.near = 10;
tableLight.shadow.camera.far = 100;
tableLight.shadow.camera.left = -30;
tableLight.shadow.camera.right = 30;
tableLight.shadow.camera.top = 30;
tableLight.shadow.camera.bottom = -30;
scene.add(tableLight);

let shadowsOn = true;
let pointLightOn = true;
const lightMoveStep = 5;
const clock = new THREE.Clock();

// Load GLTF scene
const loader = new GLTFLoader();
loader.load(
    'assets/fantasy_interior/scene.gltf',
    function (gltf) {
        gltf.scene.position.set(-2700, -20, 800);
        gltf.scene.scale.set(50, 50, 50);
        scene.add(gltf.scene);
        
        // Initialize game after scene is loaded
        game = new Game(scene);
        
        camera.position.set(0, 120, 80);
        camera.lookAt(0, 0, 0);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

function animate() {
    const delta = clock.getDelta();
    if (game) {
        game.updateAnimations(delta);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function keyHandler(e) {
    switch (e.key) {
        case "w":
            tableLight.position.z -= lightMoveStep;
            break;
        case "s":
            tableLight.position.z += lightMoveStep;
            break;
        case "a":
            tableLight.position.x -= lightMoveStep;
            break;
        case "d":
            tableLight.position.x += lightMoveStep;
            break;
        case "l":
            ambientLightOn = !ambientLightOn;
            ambientLight.visible = ambientLightOn;
            break;
        case "p":
            pointLightOn = !pointLightOn;
            tableLight.visible = pointLightOn;
            console.log(`Point light toggled: ${pointLightOn}`);
            break;
        case "m":
            shadowsOn = !shadowsOn;
            tableLight.castShadow = shadowsOn;
            floor.mesh.receiveShadow = shadowsOn;
            table.tableGroup.traverse((object) => {
                if (object.isMesh) object.castShadow = shadowsOn;
            });
            console.log(`Shadow on toggled: ${shadowsOn}`);
            break;
        case "n":
            if (game && game.isGameOn) {
                game.nextTurn();
            } else {
                console.log("Game is over");
            }
            break;
    }
}

document.addEventListener("keydown", keyHandler, false);
