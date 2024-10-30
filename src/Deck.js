import { Card } from "./Card";
// Deck class
class Deck {
    constructor(scene, numCards = 52) {
        this.cards = [];
        for (let i = 0; i < numCards; i++) {
            const card = new Card(i);
            this.cards.push(card);
            
       
            card.setPosition(0, 15, i * 0.1); 
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

export { Deck }
