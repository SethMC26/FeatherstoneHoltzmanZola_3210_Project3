
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Table } from './sceneObjects';


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

//create a new table with size 16 (size scaling is still WIP)
let table = new Table(20);
//add tableGroup(all objects of table)
scene.add(table.tableGroup);

// This is a wrapper function (needed for the requestAnimationFrame call above) for render
function animate(){
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame(animate);
}
animate()