import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';
import { Card } from './Card';
import { Deck } from './Deck';
import { Game } from './game';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
let game;
let debug = true;

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
const ambientLight = new THREE.AmbientLight(0xfff2d9, 0.8);
scene.add(ambientLight);
let ambientLightOn = true;

// Add directional light to simulate sunlight through windows
const sunLight = new THREE.DirectionalLight(0xfff2d9, 2.5); // Warm sunlight color
sunLight.position.set(-1000, 1500, -1000); // Position for angled sunlight
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 100;
sunLight.shadow.camera.far = 3000;
sunLight.shadow.camera.left = -1000;
sunLight.shadow.camera.right = 1000;
sunLight.shadow.camera.top = 1000;
sunLight.shadow.camera.bottom = -1000;
scene.add(sunLight);

// Modify table light to be less intense
const tableLight = new THREE.PointLight(0xFFFFFF, 2000);
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

// Add after scene creation, before GLTF loader
createSkybox();

// Load GLTF scene
const loader = new GLTFLoader();
loader.load(
    'assets/fantasy_interior/scene.gltf',
    function (gltf) {
        // Set up shadow casting for all meshes in the scene
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                // Enable shadow casting for all meshes
                node.castShadow = true;
                node.receiveShadow = true;

                // Special cases for specific object types
                if (node.name.toLowerCase().includes('floor')) {
                    // Floors should receive but not cast shadows
                    node.castShadow = false;
                    node.receiveShadow = true;
                } else if (node.name.toLowerCase().includes('wall')) {
                    // Walls should cast and receive shadows
                    node.castShadow = true;
                    node.receiveShadow = true;
                } else if (node.name.toLowerCase().includes('lamp')) {
                    // Lamp objects should cast shadows
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            }
        });

        gltf.scene.position.set(-2700, -20, 800);
        gltf.scene.scale.set(50, 50, 50);
        
        addLightsToLamps(gltf.scene);
        
        ambientLight.intensity = 5;
        tableLight.intensity = 1000;
        
        scene.add(gltf.scene);
        game = new Game(scene);
        
        camera.position.set(0, 120, 80);
        camera.lookAt(0, 0, 0);

        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                if (node.name.toLowerCase().includes('window')) {
                    // Make windows slightly reflective and transparent
                    node.material = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.3,
                        metalness: 0.3,
                        roughness: 0.1,
                        envMapIntensity: 1.5
                    });
                } else if (node.name.toLowerCase().includes('floor')) {
                    // Make floor slightly reflective
                    node.material.metalness = 0.1;
                    node.material.roughness = 0.7;
                }
            }
        });
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

function addLightsToLamps(gltfScene) {
    const lampIntensity = 500;
    const lampColor = 0xfff2d9;
    const lampRadius = 150;
    let lightCount = 0;
    const maxLights = 8;
    
    gltfScene.traverse((node) => {
        if (node.name.toLowerCase().includes('lamp')) {
            if (lightCount < maxLights) {
                const light = new THREE.PointLight(lampColor, lampIntensity, lampRadius);
                light.position.copy(node.position);
                light.castShadow = true;
                light.shadow.mapSize.width = 512;
                light.shadow.mapSize.height = 512;
                
                if (debug) {
                    const sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
                    const sphereMaterial = new THREE.MeshBasicMaterial({ 
                        color: lampColor,
                        transparent: true,
                        opacity: 0.1
                    });
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    light.add(sphere);
                }
                
                node.add(light);
                lightCount++;
            }
        }
    });
}

function createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const skyboxTexture = loader.load([
        'assets/skybox/px.bmp', // positive x
        'assets/skybox/nx.bmp', // negative x
        'assets/skybox/py.bmp', // positive y
        'assets/skybox/ny.bmp', // negative y
        'assets/skybox/pz.bmp', // positive z
        'assets/skybox/nz.bmp'  // negative z
    ]);
    scene.background = skyboxTexture;
}
