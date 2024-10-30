import * as THREE from 'three';


// Card class definition
class Card {
    constructor(id, suit, rank, width = 2.5, height = 3.5) {
        // Define suits and ranks for cards
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        this.id = id;
        this.suit = suit;
        this.rank = rank;

        //texture should be loaded in not sure how this would work 
        //const texture = new THREE.CanvasTexture(canvas);

        // Create front and back materials
        const frontMaterial = new THREE.MeshBasicMaterial();
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide});
        
        //code below doesnt seem to work?
        //const materials = [backMaterial, frontMaterial];

        // Geometry and mesh
        const geometry = new THREE.PlaneGeometry(width, height);
        this.mesh = new THREE.Mesh( geometry, backMaterial);
        //this.mesh.userData = { id: id, suit: suit, rank: rank };
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

export { Card }
