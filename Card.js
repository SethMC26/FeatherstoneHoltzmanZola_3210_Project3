import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 20;

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillText(`${this.rank} of ${this.suit}`, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);

        // Front and back materials
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

class Deck {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        let id = 0;

        // Create 50 cards (13 ranks * 4 suits = 52, but we'll limit to 50)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < ranks.length; j++) {
                if (this.cards.length < 50) { // Ensure we only create 50 cards
                    const card = new Card(id++, suits[i], ranks[j]);
                    card.setPosition(0, 0, this.cards.length * 0.01); // Stack with slight z-offset
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

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
