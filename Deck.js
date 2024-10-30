import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 15, 30); // Adjust the camera position for visibility
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Basic lighting to see materials
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Card class
class Card {
    constructor(id, width = 5, height = 7.5) {
        this.id = id;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.userData = { id: id };
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }
}

// Deck class
class Deck {
    constructor(scene, numCards = 50) {
        this.cards = [];
        for (let i = 0; i < numCards; i++) {
            const card = new Card(i);
            this.cards.push(card);
            
       
            card.setPosition(0, 0, i * 0.1); 
            card.addToScene(scene);
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            scene.remove(this.cards[index].mesh);
            this.cards.splice(index, 1);
        }
    }
}

// Create and add deck to the scene
const deck = new Deck(scene, 50);

// Animation loop
function animate() {
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

