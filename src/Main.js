
import * as THREE from 'three';
import { OrbitControls } from "https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js";
import { Floor, Table } from './SceneObjects.js';
import { Game } from './Game.js';


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 3000);
//camera.position.set(-57, 36, 0)  // Try moving this around!
camera.position.set(0, 30, 55)
camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
// If you want this to span the window, instead of using the myCanvas object, use the window object
//renderer.setPixelRatio(document.getElementById('myCanvas').devicePixelRatio);
// If you want the render to span the window, uncomment this
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//basic controls for testing 
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.update();

//create a new table with size 16 (size scaling is still WIP)
const table = new Table(16);
table.tableGroup.traverse((object) => {
    if (object.isMesh) {
        object.castShadow = true;
    }
});
scene.add(table.tableGroup);

//create floor
const floor = new Floor(16);
floor.mesh.receiveShadow = true;
scene.add(floor.mesh);

// Enable shadow maps on the renderer
renderer.shadowMap.enabled = true;

// Ambient light with initial blue color
const ambientLight = new THREE.AmbientLight(0xf59a40, 1);
scene.add(ambientLight);
let ambientLightOn = true;


// Directional light above the table for stronger shadow casting
const tableLight = new THREE.PointLight(0xFFFFFF, 2.5);
tableLight.position.set(0, 30, 0);
tableLight.castShadow = true;
scene.add(tableLight);


const clock = new THREE.Clock();

const game = new Game(scene);

let shadowsOn = true;

let pointLightOn = true;

const lightMoveStep = 5;

// Animation loop
function animate() {
    //update any animations by delta 
    const delta = clock.getDelta();
    game.updateAnimations(delta)

    //controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
// Start the animation loop
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// Simple way to setup keybaord controls:
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
            break;
        case "m":
            shadowsOn = !shadowsOn;
            tableLight.castShadow = shadowsOn;
            floor.mesh.receiveShadow = shadowsOn;
            table.tableGroup.traverse((object) => {
                if (object.isMesh) object.castShadow = shadowsOn;
            });
            break;

        case "n":
            if (game.isGameOn) {
                game.nextTurn()
            }
            else {
                console.log("Game is over")
            }
            break;
    }
}
document.addEventListener("keydown", keyHandler, false);

//add touch for mobile users 
document.addEventListener("touchstart", handleTouch, false);
function handleTouch(e) {

    // Check if the game is on
    if (game.isGameOn) {
        game.nextTurn();
    } else {
        console.log("Game is over");
    }
}
