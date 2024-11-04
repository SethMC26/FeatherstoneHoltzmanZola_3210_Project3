
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';
import { Card } from './Card';
import { Deck } from './Deck';
import { Game } from './game';


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

//create a new table with size 16 (size scaling is still WIP)
const table = new Table(16);
table.tableGroup.traverse((object) => {
    if (object.isMesh) object.castShadow = true;
});
scene.add(table.tableGroup);

//create floor
const floor = new Floor(16);
floor.mesh.receiveShadow = true;
scene.add(floor.mesh);

// Enable shadow maps on the renderer
renderer.shadowMap.enabled = true;

// Ambient light with initial blue color
const ambientLight = new THREE.AmbientLight(0x0000FF, 0.5);
scene.add(ambientLight);
let ambientLightOn = true;


// Directional light above the table for stronger shadow casting
const tableLight = new THREE.PointLight(0xFFFFFF, 1, 50);
tableLight.position.set(0, 50, 0);
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


const clock = new THREE.Clock();

const game = new Game(scene);

let shadowsOn = true;

let pointLightOn = true;



/* for testing new animations 
let card = new Card(2, 11)
card.mesh.rotateX(Math.PI/2)
card.mesh.rotateZ(Math.PI/2)
card.setPosition(25,12.5,0)
scene.add(card.mesh)

let xAxis = new THREE.Vector3( 1 , 0, 0 );
let qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI * 2);
let quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], 
    [ 
        card.mesh.quaternion.x, card.mesh.quaternion.y, card.mesh.quaternion.z, card.mesh.quaternion.w, 
        -card.mesh.quaternion.x, -card.mesh.quaternion.y, card.mesh.quaternion.z, card.mesh.quaternion.w,
        qFinal.x, qFinal.y, qFinal.z, qFinal.w,
    ] );
let position = new THREE.VectorKeyframeTrack('.position', [0,1,2],
    [ 
        25, 9.5, 0, 
        15, 20, 0, 
        7, 12.5, 0 
    ])
let clip = new THREE.AnimationClip('action', 3, [ position, quaternionKF])
let mixer = new THREE.AnimationMixer(card.mesh)
const moveToCenterP1 = mixer.clipAction( clip )
//moveToCenterP1.play()
moveToCenterP1.clampWhenFinished = true; 
*/

// Animation loop
function animate() {
    const delta = clock.getDelta();
    //mixer.update(delta)
    //update animations 
    game.updateAnimations(delta)
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

        case "l":
            ambientLightOn = !ambientLightOn;
            ambientLight.visible = ambientLightOn;
            break;
        case "p":
            pointLightOn = !pointLightOn;
            tableLight.visible = pointLightOn; // Toggle visibility
            console.log(`Point light toggled: ${pointLightOn}`); // Log light toggle state
            break;l
        case "m":
            shadowsOn = !shadowsOn;
            tableLight.castShadow = shadowsOn;
            floor.mesh.receiveShadow = shadowsOn;
            table.tableGroup.traverse((object) => {
                if (object.isMesh) object.castShadow = shadowsOn;
            });
            break; 
        case "n":
            game.nextTurn()
            break;
    }
}
document.addEventListener("keydown", keyHandler, false);
