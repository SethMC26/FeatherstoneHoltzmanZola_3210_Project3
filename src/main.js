
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
document.body.appendChild(renderer.domElement);

//basic controls for testing 
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//basic light to see materials
let light = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(light)

//create a new table with size 16 (size scaling is still WIP)
let table = new Table(16);
//add tableGroup(all objects of table)
scene.add(table.tableGroup);

//create floor
let floor = new Floor(16);
scene.add(floor.mesh)

// Basic light to see materials
const light2 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light2);

let card = new Card(2, 11)
card.mesh.rotateX(Math.PI/2)
card.mesh.rotateZ(Math.PI/2)
card.setPosition(-30,12.5,0)
scene.add(card.mesh)

let xAxis = new THREE.Vector3( 1 , 0, 0 );
let qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, -Math.PI * 2);
let quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], 
    [ 
        card.mesh.quaternion.x, card.mesh.quaternion.y, card.mesh.quaternion.z, card.mesh.quaternion.w, 
        qFinal.x, qFinal.y, qFinal.z, qFinal.w,
        -card.mesh.quaternion.x, -card.mesh.quaternion.y, card.mesh.quaternion.z, card.mesh.quaternion.w
    ] );
let position = new THREE.VectorKeyframeTrack('.position', [0,1,2],
    [ 
        -30, 11, 0, 
        -14.5, 15, 0, 
        -7, 9.5, 0 
    ])
let clip = new THREE.AnimationClip('action', 3, [ position, quaternionKF])
let mixer = new THREE.AnimationMixer(card.mesh)

const moveToCenterP1 = mixer.clipAction( clip )
//moveToCenterP1.loop = THREE.LoopOnce
moveToCenterP1.clampWhenFinished = true; 

let card2 = new Card(2, 12) 
card2.mesh.rotateX(Math.PI/2)
card2.setPosition(0,12.5,25)
scene.add(card2.mesh)

xAxis = new THREE.Vector3(0, -1, 0)
qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2)
quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2],
    [
        card2.mesh.quaternion.x, card2.mesh.quaternion.y, card2.mesh.quaternion.z, card2.mesh.quaternion.w, 
        qFinal.x, qFinal.y, qFinal.z, qFinal.w,
        -card2.mesh.quaternion.x, -card2.mesh.quaternion.y, -card2.mesh.quaternion.z, card2.mesh.quaternion.w
    ]
)
position = new THREE.VectorKeyframeTrack('.position', [0, 1, 2] , 
    [
        0 , 11, 25, 
        0 , 15, 15, 
        0, 9.5, 0 
    ])
let clip2 = new THREE.AnimationClip('action', 3, [ position, quaternionKF])
let mixer2= new THREE.AnimationMixer(card2.mesh)

const moveToCenterp2 = mixer2.clipAction ( clip2 );

//add card 
let card3 = new Card(1, 8)
card3.mesh.rotateX(Math.PI/2)
card3.mesh.rotateZ(Math.PI/2)
card3.setPosition(30,12.5,0)
scene.add(card3.mesh)

xAxis = new THREE.Vector3( 1, 0, 0 );
qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, -Math.PI * 2);
quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], 
    [ 
    card3.mesh.quaternion.x, card3.mesh.quaternion.y, card3.mesh.quaternion.z, card3.mesh.quaternion.w, 
    qFinal.x, qFinal.y, qFinal.z, qFinal.w,
    -card3.mesh.quaternion.x, -card3.mesh.quaternion.y, card3.mesh.quaternion.z, card3.mesh.quaternion.w, 
]);
position = new THREE.VectorKeyframeTrack('.position', [0,1,2],
    [ 
        30, 11, 0, 15, 15, 0, 7, 9.5, 0 
    ])
let clip3 = new THREE.AnimationClip('action', 3, [ position, quaternionKF])
let mixer3 = new THREE.AnimationMixer(card3.mesh)

const moveToCenterP3 = mixer3.clipAction( clip3 )
//moveToCenterP3.loop = THREE.LoopOnce
moveToCenterP3.clampWhenFinished = true; 

moveToCenterP3.play()
moveToCenterp2.play()
moveToCenterP1.play()

const clock = new THREE.Clock();

const game = new Game(scene);

// Animation loop
function animate() {
    const delta = clock.getDelta();

    mixer.update( delta );
    mixer2.update( delta )
    mixer3.update( delta );
    
    
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation loop
animate();