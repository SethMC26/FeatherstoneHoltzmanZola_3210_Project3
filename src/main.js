import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.set(0, 0, 100)  // Try moving this around!
camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
scene.add( camera );

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
// If you want this to span the window, instead of using the myCanvas object, use the window object
//renderer.setPixelRatio(document.getElementById('myCanvas').devicePixelRatio);
// If you want the render to span the window, uncomment this
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//basic controls for testing 
const controls = new OrbitControls( camera, renderer.domElement );
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
    renderer.render( scene, camera );
    requestAnimationFrame(animate);
}
animate()