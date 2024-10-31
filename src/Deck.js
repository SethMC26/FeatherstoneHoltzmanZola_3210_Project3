import { Card } from "./Card";

//create two enums which are suits and ranks useful to map them to numbers
const Suits = Object.freeze({
    Hearts: 0,
    Diamonds: 1,
    Clubs: 3,
    Spades: 4
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

        let numCards = 52
        let id = 0;

        //code below from ChatGPT
        for (const suit in Suits) {
            for (const rank in Ranks) {
                //if (id >= numCards) return; // Stops adding cards if deck limit is reached
                const card = new Card(id, Suits[suit], Ranks[rank]);
                this.cards.push(card);

                // Position cards in a stack
                card.setPosition(0, 15, id * 0.1);
                card.addToScene(scene);
                id++;
            }
        }

        console.log(this.cards[0].rank < this.cards[1].rank)
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

    toString() {
        return ""
    }
}

export { Deck }
