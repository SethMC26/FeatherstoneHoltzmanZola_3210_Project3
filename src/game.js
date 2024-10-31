import { Card } from "./Card";
import { Deck } from "./Deck"

class Game {
    constructor(scene) {
        //create new Deck
        const deck = new Deck(scene);

        //shuffle deck 
        deck.shuffle()

        //Create players
        this.p1 = new Player(1, deck.cards.slice(0, 17))
        //move cards to p1 area
        for (let card of this.p1.cards) {
            card.mesh.translateX(35)
        }
        console.debug(this.p1.cards)

        this.p2 = new Player(2, deck.cards.slice(17,34))
        //move cards to p2 area
        for (let card of this.p2.cards) {
            card.mesh.translateY(-35)
        }
        console.debug(this.p2.cards)

        this.p3 = new Player(3, deck.cards.slice(34, 52))
        //move cards to p3 area
        for (let card of this.p3.cards) {
            card.mesh.translateY(35)
        }
        console.debug(this.p3.cards)

        //TO:DO add end game logic 
        for (let i = 0; i < 1000; i++ ) {
            this.nextTurn();
        }
    }

    nextTurn() {
        console.log("NEW TURN -------------------------")
        let p1Card = this.p1.cards.shift()
        let p2Card = this.p2.cards.shift()
        let p3Card = this.p3.cards.shift() 

        //crude way to handle player running out of cards will improve 
        if (!p1Card) {
            p1Card = new Card(-1, -1, -1, 0,0)
        }

        if (!p2Card) {
            p2Card = new Card(-1, -1, -1, 0,0)
        }

        if (!p3Card) {
            p3Card = new Card(-1, -1, -1, 0, 0)
        }

        console.log("p1 card", p1Card, "p2 card", p2Card, "p3 card", p3Card)

        if (p1Card.rank == p2Card.rank && p2Card.rank == p3Card.rank) {
            console.warn("War...what is is good for...absolutely nothing")
        }
        else {
            if (p1Card.rank > p2Card.rank && p1Card.rank > p3Card.rank) {
                //add cards to winner
                this.p1.cards.push(p1Card, p2Card, p3Card)
                console.log("p1 wins")
            }
            else if (p2Card.rank > p1Card.rank && p2Card.rank > p3Card.rank) {
                //add cards to winner
                this.p2.cards.push(p1Card, p2Card, p3Card)
                console.log("p2 win")
            }
            else {
                //add cards to winner
                this.p3.cards.push(p1Card, p2Card, p3Card)
                console.log("p3 wins")
            }
        }
    }
}

class Player {
    constructor(playerNumber, cards) {
        this.number = playerNumber
        this.cards = cards;

    }
}



export { Game }