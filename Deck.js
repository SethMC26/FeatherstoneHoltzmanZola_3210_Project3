class Deck {
    constructor(scene, numCards = 50) {
        this.cards = [];
        for (let i = 0; i < numCards; i++) {
            const card = new Card(i);
            this.cards.push(card);
            
            // Stack the cards with slight z-offsets
            card.setPosition(0, 0, i * 0.01); // Offset each card in the z-direction
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

const deck = new Deck(scene); // Create a deck of 50 cards

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

