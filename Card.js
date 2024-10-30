import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0, 5, 20); // Adjust camera position for better visibility

// Define suits and ranks for cards
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Card class definition
class Card {
    constructor(id, suit, rank, width = 2.5, height = 3.5) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;

        // Create the card front texture with text
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 384;
        const context = canvas.getContext('2d');

        // Draw card background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw suit and rank text
        context.fillStyle = '#000000';
        context.font = 'bold 24px Arial'; 
        context.textAlign = 'center';
        context.fillText(`${this.rank} of ${this.suit}`, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);

        // Create front and back materials
        const frontMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const materials = [backMaterial, frontMaterial];

        // Geometry and mesh
        const geometry = new THREE.PlaneGeometry(width, height);
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

// Deck class definition
class Deck {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        let id = 0;

        // Create 50 cards 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < ranks.length; j++) {
                if (this.cards.length < 50) { 
                    const card = new Card(id++, suits[i], ranks[j]);
                    card.setPosition((this.cards.length % 10) * 3, Math.floor(this.cards.length / 10) * 0.1, this.cards.length * 0.05);
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
}

// Create and add the deck to the scene
const deck = new Deck(scene);

// Adding ambient light for better visibility
const light = new THREE.AmbientLight(0xffffff, 1); 
scene.add(light);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
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
