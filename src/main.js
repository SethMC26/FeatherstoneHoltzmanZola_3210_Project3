import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';
import { Card } from './Card';
import { Deck } from './Deck';
import { Game } from './game';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 3000);
//camera.position.set(-57, 36, 0)  // Try moving this around!
camera.position.set(0, 30, 70)
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
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//basic light to see materials
let light = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(light)

// //create a new table with size 16 (size scaling is still WIP)
// let table = new Table(20);
// //add tableGroup(all objects of table)
// scene.add(table.tableGroup);

// //create floor
// let floor = new Floor(20);
// scene.add(floor.mesh)

// Initialize the loader
const loader = new GLTFLoader();

// Load the game room model
loader.load(
  'assets/fantasy_interior/scene.gltf', // Replace with the path to your downloaded model
  function (gltf) {
    // Adjust the model's position
    gltf.scene.position.set(-2700, -20, 750); // Center the model

    // Adjust the camera's position
    camera.position.set(0, 100, 120); // Move the camera to a better position

    // Add the loaded model to the scene
    gltf.scene.scale.set(50, 50, 50);
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened', error);
  }
);

// This is a wrapper function (needed for the requestAnimationFrame call above) for render
function animate(){
    controls.update();
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

        /*
        case "t":
            card.mesh.position.set(0,10,0)
            break;
        */
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
