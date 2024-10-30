
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Floor, Table } from './sceneObjects';


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 3000);
camera.position.set(0, 0, 100)  // Try moving this around!
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
let table = new Table(20);
//add tableGroup(all objects of table)
scene.add(table.tableGroup);

//create floor
let floor = new Floor(20);
scene.add(floor.mesh)

// Basic light to see materials
const light2 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light2);

// Suits and ranks for cards
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


// Card class
class Card {
    constructor(id, suit, rank, width = 5, height = 7.5) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;

        // Create the front texture with suit and rank
        const frontCanvas = document.createElement('canvas');
        frontCanvas.width = 256;
        frontCanvas.height = 384;
        const context = frontCanvas.getContext('2d');

        // Draw card background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, frontCanvas.width, frontCanvas.height);

        // Draw suit and rank text
        context.fillStyle = '#000000';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(`${this.rank} of ${this.suit}`, frontCanvas.width / 2, frontCanvas.height / 2);

        const frontTexture = new THREE.CanvasTexture(frontCanvas);
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Card back

        // Create the card mesh
        const geometry = new THREE.PlaneGeometry(width, height);
        const materials = [backMaterial, frontTexture]; // Back and front materials
        this.mesh = new THREE.Mesh(geometry, materials);
        this.mesh.userData = { id: id, suit: suit, rank: rank };
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
        this.scene = scene;
        this.cards = [];
        let id = 0;

        for (let i = 0; i < 4; i++) { // Only create up to 4 suits
            for (let j = 0; j < ranks.length; j++) {
                if (this.cards.length < numCards) {
                    const card = new Card(id++, suits[i], ranks[j]);
                    card.setPosition(0, 0, this.cards.length * 0.01); // Stack cards slightly
                    card.addToScene(scene);
                    this.cards.push(card);
                }
            }
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
            this.scene.remove(this.cards[index].mesh);
            this.cards.splice(index, 1);
        }
    }
}

// Create and add deck to the scene
const deck = new Deck(scene, 50);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
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