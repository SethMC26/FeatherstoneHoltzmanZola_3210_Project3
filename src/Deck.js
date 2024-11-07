import { Card } from "./Card.js";

//create two enums which are suits and ranks useful to map them to numbers
const Suits = Object.freeze({
    Hearts: 0,
    Diamonds: 1,
    Clubs: 2,
    Spades: 3
})

const Ranks = Object.freeze({
    Two: 2, 
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12, 
    King: 13,
    Ace: 14
})
// Deck class
class Deck {
    constructor(scene) {
        this.cards = [];

        //code below from ChatGPT
        for (const suit in Suits) {
            for (const rank in Ranks) {
                //if (id >= numCards) return; // Stops adding cards if deck limit is reached
                const card = new Card(Suits[suit], Ranks[rank]);
                this.cards.push(card);

                // Position cards in a stack
                card.mesh.rotateX(Math.PI/2)

                card.addToScene(scene);
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    //not sure we need this 
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            scene.remove(this.cards[index].mesh);
            this.cards.splice(index, 1);
        }
    }


}

export { Deck }
